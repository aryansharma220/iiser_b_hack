'use client';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUserPlus, FaExclamationCircle } from 'react-icons/fa';
import CandidateForm from './CandidateForm';

export default function CandidateManager() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadElections();
    
    // Set up SSE connection
    const eventSource = new EventSource('/api/elections/updates');
    
    eventSource.onmessage = (event) => {
      if (event.data === 'connected') return;
      
      const update = JSON.parse(event.data);
      
      if (update.type === 'candidateAdded' || update.type === 'candidateRemoved') {
        // Reload elections data when candidates change
        loadElections();
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const loadElections = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setElections(data.active_elections || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load elections:', error);
      setIsLoading(false);
    }
  };

  const handleAddCandidate = async (candidateData) => {
    try {
      const response = await fetch(`/api/elections/${selectedElection.id}/positions/${selectedPosition.id}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      });

      if (response.ok) {
        await loadElections();
        setIsAddingCandidate(false);
      }
    } catch (error) {
      console.error('Failed to add candidate:', error);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!confirm('Are you sure you want to remove this candidate?')) return;

    try {
      const response = await fetch(
        `/api/elections/${selectedElection.id}/positions/${selectedPosition.id}/candidates/${candidateId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await loadElections();
      }
    } catch (error) {
      console.error('Failed to delete candidate:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] space-y-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-1/4"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isAddingCandidate && selectedPosition) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 ease-in-out">
        <CandidateForm
          position={selectedPosition}
          onSubmit={handleAddCandidate}
          onCancel={() => setIsAddingCandidate(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
        <span className="border-b-2 border-blue-500 pb-2">Manage Candidates</span>
      </h3>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
              Select Election
            </label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         dark:bg-gray-700 dark:border-gray-600 transition-all hover:border-blue-300 bg-transparent"
              onChange={(e) => {
                const election = elections.find(el => el.id === e.target.value);
                setSelectedElection(election);
                setSelectedPosition(null);
              }}
              value={selectedElection?.id || ''}
            >
              <option value="">Choose an election...</option>
              {elections.map(election => (
                <option key={election.id} value={election.id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>

          {selectedElection && (
            <div className="space-y-2 group animate-fadeIn">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                Select Position
              </label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           dark:bg-gray-700 dark:border-gray-600 transition-all hover:border-blue-300 bg-transparent"
                onChange={(e) => {
                  const position = selectedElection.positions.find(pos => pos.id === e.target.value);
                  setSelectedPosition(position);
                }}
                value={selectedPosition?.id || ''}
              >
                <option value="">Choose a position...</option>
                {selectedElection.positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedPosition && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mt-8 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                <span>{selectedPosition.title}</span>
                <span className="text-sm text-gray-500">({selectedPosition.candidates?.length || 0} candidates)</span>
              </h4>
              <button
                onClick={() => setIsAddingCandidate(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                           transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 
                           shadow-lg hover:shadow-xl active:scale-95"
              >
                <FaUserPlus className="text-sm" />
                <span>Add Candidate</span>
              </button>
            </div>

            {selectedPosition.candidates?.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FaExclamationCircle className="mx-auto text-4xl mb-4" />
                <p>No candidates yet. Add your first candidate!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {selectedPosition.candidates?.map(candidate => (
                  <div key={candidate.id}
                    className="group p-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 
                             rounded-xl hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 
                                     transition-colors">
                          {candidate.name}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Roll No: {candidate.rollNumber}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full 
                                   transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Delete candidate"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {candidate.manifesto}
                    </p>
                    <div className="mt-4 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Agenda Points
                      </p>
                      <ul className="space-y-2">
                        {candidate.agenda.map((item, idx) => (
                          <li key={idx} 
                              className="text-sm text-gray-600 dark:text-gray-300 flex items-start 
                                       hover:text-blue-500 transition-colors">
                            <span className="mr-2 text-blue-500">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
