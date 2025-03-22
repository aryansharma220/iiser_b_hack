'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUserCircle, FaClock, FaClipboardList, FaMoon, FaSun } from 'react-icons/fa';
import elections from '../../../lib/elections.json';
import voters from '../../../lib/voter.json';

function VoterDashboard() {
  const router = useRouter(); // Add router initialization
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibleElections, setEligibleElections] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [activeElection, setActiveElection] = useState(null);
  const [voted, setVoted] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const voterData = localStorage.getItem('voter');
      
      if (!voterData) {
        throw new Error('Session expired. Please login again.');
      }

      const storedVoter = JSON.parse(voterData);
      
      // Validate session timestamp (24-hour expiry)
      const sessionAge = Date.now() - storedVoter.timestamp;
      if (sessionAge > 24 * 60 * 60 * 1000) {
        throw new Error('Session expired. Please login again.');
      }

      // Find complete voter data from voters.json
      const completeVoterData = voters.find(v => v.email === storedVoter.email);
      
      if (!completeVoterData) {
        throw new Error('Voter not found in database');
      }

      const fullVoterData = {
        ...storedVoter,
        name: completeVoterData.name,
        department: completeVoterData.department,
        yearOfStudy: completeVoterData.yearOfStudy
      };

      setVoter(fullVoterData);
      filterEligibleElections(fullVoterData);
    } catch (error) {
      console.error('Dashboard Error:', error);
      setDashboardError(error.message);
      setTimeout(() => {
        localStorage.clear();
        router.push('/login/voter');
      }, 3000);
    }
  }, [router]);

  useEffect(() => {
    // Check for system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const getElectionStatus = (timeline) => {
    try {
      const now = new Date().getTime();
      const startTime = new Date(timeline.startDate).getTime();
      const endTime = new Date(timeline.endDate).getTime();

      // Add validation for dates
      if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) {
        console.error('Invalid date format:', timeline);
        return { status: 'error', text: 'Date Error', canVote: false };
      }

      console.log('Timeline check:', {
        now: new Date(now),
        start: new Date(startTime),
        end: new Date(endTime)
      });

      // Check if election is active
      const canVote = now >= startTime && now <= endTime;
      const status = canVote ? 'active' : (now < startTime ? 'upcoming' : 'ended');

      return {
        status,
        text: status === 'active' ? 'Active' : (status === 'upcoming' ? 'Not Started' : 'Ended'),
        canVote,
        timeLeft: endTime - now
      };
    } catch (error) {
      console.error('Error calculating election status:', error);
      return { status: 'error', text: 'Error', canVote: false };
    }
  };

  const isVoterEligible = (voter, election) => {
    // All voters are eligible by default
    return true;
  };

  const isElectionActive = (timeline) => {
    try {
      const now = new Date().getTime();
      const startTime = new Date(timeline.startDate).getTime();
      const endTime = new Date(timeline.endDate).getTime();
      
      return now >= startTime && now <= endTime;
    } catch (error) {
      console.error('Error checking election active status:', error);
      return false;
    }
  };

  const filterEligibleElections = (voter) => {
    try {
      console.log('Starting election filtering for voter:', voter);
      
      const eligible = elections.active_elections.filter(election => {
        console.log(`\nChecking election: ${election.id}`);
        
        // Check if election is active
        const active = isElectionActive(election.timeline);
        console.log(`- Active status: ${active}`);
        
        // If not active, skip eligibility check
        if (!active) {
          console.log('- Skipping (not active)');
          return false;
        }

        // Check voter eligibility
        const eligible = isVoterEligible(voter, election);
        console.log(`- Eligibility: ${eligible}`);

        return active && eligible;
      });

      console.log('\nFinal eligible elections:', eligible);
      setEligibleElections(eligible);
    } catch (error) {
      console.error('Error filtering elections:', error);
      setEligibleElections([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (timeline) => {
    const status = getElectionStatus(timeline);
    
    if (status.status === 'error') return 'Invalid date';
    if (status.status === 'ended') return 'Election ended';
    if (status.status === 'upcoming') return `Starts in ${Math.floor(status.timeLeft / (1000 * 60 * 60 * 24))} days`;
    return `${Math.floor(status.timeLeft / (1000 * 60 * 60 * 24))} days remaining`;
  };

  const handleCandidateSelect = (positionId, candidateId) => {
    setSelectedCandidates(prev => {
      const position = activeElection.positions.find(p => p.id === positionId);
      const maxSelections = position.maxSelections || 1;
      
      if (!prev[positionId]) {
        return { ...prev, [positionId]: [candidateId] };
      }

      if (prev[positionId].includes(candidateId)) {
        return {
          ...prev,
          [positionId]: prev[positionId].filter(id => id !== candidateId)
        };
      }

      if (prev[positionId].length < maxSelections) {
        return {
          ...prev,
          [positionId]: [...prev[positionId], candidateId]
        };
      }

      return prev;
    });
  };

  const handleVoteSubmit = async () => {
    setLoading(true);
    try {
      // Validate all positions have selections
      const unselectedPositions = activeElection.positions.filter(position => {
        const selections = selectedCandidates[position.id] || [];
        return selections.length !== position.maxSelections;
      });

      if (unselectedPositions.length > 0) {
        const positions = unselectedPositions.map(p => p.title).join(', ');
        throw new Error(`Please select candidates for: ${positions}`);
      }

      // Check if voter has already voted
      const hasVoted = localStorage.getItem(`voted_${activeElection.id}`);
      if (hasVoted) {
        throw new Error('You have already voted in this election');
      }

      // Submit votes to API
      const response = await fetch('/api/votes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId: activeElection.id,
          votes: selectedCandidates,
          voterId: voter.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Store vote in localStorage
      localStorage.setItem(`voted_${activeElection.id}`, 'true');
      
      // Show success message temporarily
      setVoted(true);
      setConfirmDialog(false);

      // Reset after delay and redirect back to elections list
      setTimeout(() => {
        setVoted(false);
        setActiveElection(null);
        setSelectedCandidates({});
        // Refresh eligible elections
        const voterData = JSON.parse(localStorage.getItem('voter'));
        filterEligibleElections(voterData);
      }, 2000);

    } catch (error) {
      setDashboardError(error.message);
      setTimeout(() => {
        setDashboardError('');  // Clear error after showing
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleElectionClick = (election) => {
    try {
      console.log('Election clicked:', election);
      const hasVoted = localStorage.getItem(`voted_${election.id}`);
      
      if (hasVoted) {
        alert('You have already voted in this election');
        return;
      }

      setActiveElection(election);
    } catch (error) {
      console.error('Error handling election click:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <div className="text-center p-8">
          <div className="mx-auto h-16 w-16 text-red-500 mb-4">
            <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{dashboardError}</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (voted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <div className="text-center p-8">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank you for voting!</h2>
          <p className="text-gray-600 dark:text-gray-300">Your votes have been recorded successfully.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-gray-900 transition-colors duration-200">
      {/* Add animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10"/>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.1) 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}/>
      </div>

      {/* Add dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-24 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50 hover:scale-110 transition-transform"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <FaSun className="w-5 h-5 text-yellow-500" />
        ) : (
          <FaMoon className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {/* Main content */}
      <div className="relative z-10">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voting Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Welcome, {voter?.name || 'Voter'}
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear(); // Clear all localStorage items
                  router.push('/login/voter');
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Elections List */}
          {!activeElection ? (
            <div className="max-w-7xl mx-auto space-y-8">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-6">
                Active Elections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eligibleElections.length > 0 ? (
                  eligibleElections.map((election) => {
                    const electionStatus = getElectionStatus(election.timeline);
                    console.log(`Election ${election.id} status:`, electionStatus);
                    return (
                      <motion.div
                        key={election.id}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-6 flex flex-col h-full">
                          {/* Election details */}
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {election.title}
                              </h3>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                electionStatus.status === 'active' 
                                  ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                                  : electionStatus.status === 'upcoming'
                                  ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
                                  : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                              }`}>
                                {electionStatus.text}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {election.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                              <FaClock className="mr-2 text-purple-500" />
                              {calculateTimeLeft(election.timeline)}
                            </div>
                            <div className="space-y-2 mb-6">
                              {election.positions.map(position => (
                                <div key={position.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                                  {position.title}
                                  <span className="ml-auto text-xs font-medium text-gray-500">
                                    {position.candidates.length} candidates
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Vote Now button - Fixed positioning relative to card */}
                          <div className="mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleElectionClick(election);
                              }}
                              className="w-full px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              <span className="flex items-center justify-center gap-2">
                                Vote Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Active Elections
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      There are currently no active elections available for you to participate in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => setActiveElection(null)}
                className="mb-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Elections
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                    {activeElection.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeElection.description}
                  </p>
                </div>

                {activeElection.positions.map(position => (
                  <div key={position.id} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {position.title}
                      </h3>
                      <span className="px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        Select {position.maxSelections}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {position.candidates.map(candidate => (
                        <motion.div
                          key={candidate.id}
                          whileHover={{ scale: 1.02 }}
                          className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                            selectedCandidates[position.id]?.includes(candidate.id)
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                          }`}
                          onClick={() => handleCandidateSelect(position.id, candidate.id)}
                        >
                          <div className="flex items-center mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {candidate.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {candidate.rollNumber}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Manifesto
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {candidate.manifesto}
                              </p>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Agenda
                              </h5>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                                {candidate.agenda.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="max-w-7xl mx-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setConfirmDialog(true)}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Submit Votes</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Confirmation Dialog */}
          {confirmDialog && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Confirm Your Vote
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This action cannot be undone. Please confirm your selection.
                  </p>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVoteSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/20"
                  >
                    Confirm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setConfirmDialog(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoterDashboard;
