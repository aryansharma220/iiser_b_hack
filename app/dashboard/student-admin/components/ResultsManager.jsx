'use client';
import { useState, useEffect } from 'react';
import { FaChartBar, FaVoteYea, FaUsers, FaChartPie, FaTrophy, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Loader } from '@/app/components/Loader';
import { Tooltip } from '@/app/components/Tooltip';

export default function ResultsManager() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousResults, setPreviousResults] = useState({});

  useEffect(() => {
    loadElections();
    // Set up polling interval for real-time updates every 5 seconds
    const interval = setInterval(() => {
      if (selectedElection) {
        fetchResults(selectedElection.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedElection]);

  useEffect(() => {
    if (results) {
      setPreviousResults(prev => ({
        ...prev,
        [selectedElection.id]: { ...prev[selectedElection.id], ...results }
      }));
    }
  }, [results, selectedElection]);

  const loadElections = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setElections(data.active_elections || []);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load elections');
      setIsLoading(false);
    }
  };

  const fetchResults = async (electionId) => {
    try {
      const response = await fetch(`/api/elections/${electionId}/results`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError('Failed to fetch results');
    }
  };

  const handleElectionChange = async (electionId) => {
    try {
      setError(null);
      const election = elections.find(e => e.id === electionId);
      setSelectedElection(election);
      
      if (election) {
        setResults(null); // Clear previous results
        await fetchResults(election.id);
      }
    } catch (error) {
      setError('Failed to load election results');
    }
  };

  const getWinningCandidate = (candidates) => {
    return Object.entries(candidates).reduce((winner, [id, current]) => {
      if (!winner || current.votes > winner.votes) {
        return { id, ...current };
      }
      return winner;
    }, null);
  };

  const getVoteMargin = (winner, runnerUp) => {
    if (!winner || !runnerUp) return 0;
    return ((winner.votes - runnerUp.votes) / winner.votes * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" className="mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading elections data...</p>
        </div>
      </div>
    );
  }

  const calculatePercentage = (votes, total) => {
    if (!total) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
            <FaChartBar className="text-2xl text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Election Results Dashboard
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Live Updates Enabled
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <select
            className="w-full p-3 pl-4 pr-10 text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 appearance-none"
            onChange={(e) => handleElectionChange(e.target.value)}
            value={selectedElection?.id || ''}
          >
            <option value="">Select an election</option>
            {elections.map(election => (
              <option key={election.id} value={election.id}>
                {election.title}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="animate-fade-in p-4 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {selectedElection && !results && (
          <div className="h-64 flex items-center justify-center">
            <Loader size="lg" />
          </div>
        )}

        {selectedElection && results && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Tooltip content="Total number of eligible voters">
                <div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100/50 dark:border-blue-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaUsers className="text-blue-500 text-xl" />
                    <h4 className="text-gray-700 dark:text-gray-200 font-medium">Total Voters</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{results.statistics.totalVoters}</p>
                </div>
              </Tooltip>
              
              <Tooltip content="Total number of votes cast">
                <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100/50 dark:border-green-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaVoteYea className="text-green-500 text-xl" />
                    <h4 className="text-gray-700 dark:text-gray-200 font-medium">Votes Cast</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{results.statistics.totalVoted}</p>
                </div>
              </Tooltip>
              
              <Tooltip content="Percentage of voters who cast their votes">
                <div className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100/50 dark:border-purple-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <FaChartPie className="text-purple-500 text-xl" />
                    <h4 className="text-gray-700 dark:text-gray-200 font-medium">Turnout</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{results.statistics.votingPercentage}%</p>
                </div>
              </Tooltip>
            </div>

            {selectedElection.positions.map(position => {
              const positionResults = results.positions[position.id];
              const previousPositionResults = previousResults[selectedElection.id]?.positions[position.id];
              const sortedCandidates = Object.entries(positionResults.candidates)
                .map(([id, data]) => ({ 
                  id, 
                  ...data,
                  trend: previousPositionResults ? 
                    data.votes - previousPositionResults.candidates[id].votes : 0
                }))
                .sort((a, b) => b.votes - a.votes);
              
              const winner = sortedCandidates[0];
              const runnerUp = sortedCandidates[1];
              const margin = getVoteMargin(winner, runnerUp);
              const isCloseRace = margin < 5; // Less than 5% difference

              return (
                <div key={position.id} className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {position.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {positionResults.totalVotes} total votes
                      </p>
                    </div>
                    {winner && (
                      <Tooltip content={`Leading by ${getVoteMargin(winner, runnerUp)}%`}>
                        <div className="flex items-center space-x-2 text-sm">
                          {isCloseRace ? (
                            <span className="px-3 py-1 rounded-full bg-yellow-100/80 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400">
                              Close Race!
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-green-100/80 dark:bg-green-900/50 text-green-700 dark:text-green-400">
                              Clear Leader
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    )}
                  </div>

                  <div className="space-y-6">
                    {sortedCandidates.map((candidate, index) => {
                      const isWinning = index === 0;
                      const percentage = ((candidate.votes / positionResults.totalVotes) * 100).toFixed(1);

                      return (
                        <div key={candidate.id} 
                          className={`relative space-y-3 p-4 rounded-lg transition-all duration-300 ${
                            isWinning 
                              ? 'bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="space-y-1 flex items-center">
                              {isWinning && (
                                <FaTrophy className="text-yellow-500 mr-2 animate-pulse" />
                              )}
                              <div>
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                  {candidate.name}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {candidate.rollNumber}
                                  </span>
                                  {candidate.trend !== 0 && (
                                    <span className={`flex items-center text-xs ${
                                      candidate.trend > 0 
                                        ? 'text-green-500' 
                                        : 'text-red-500'
                                    }`}>
                                      {candidate.trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
                                      {Math.abs(candidate.trend)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {candidate.votes} votes
                              </span>
                              <span className={`block text-sm ${
                                isWinning ? 'text-green-500' : 'text-gray-500'
                              }`}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${
                                isWinning 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700'
                              }`}
                              style={{ width: `${percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Total Votes: {positionResults.totalVotes}</span>
                      {winner && runnerUp && (
                        <span>
                          Margin: {margin}% ({winner.votes - runnerUp.votes} votes)
                        </span>
                      )}
                    </div>
                    {isCloseRace && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
                        <FaChartLine className="mr-2" />
                        This is a close race! Results may change.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {new Date(results.statistics.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}

        {!selectedElection && !isLoading && (
          <div className="text-center py-12">
            <div className="inline-block p-3 rounded-full bg-blue-50 dark:bg-blue-900/50 mb-4">
              <FaChartBar className="text-3xl text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
              Select an Election
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose an election from the dropdown above to view its results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
