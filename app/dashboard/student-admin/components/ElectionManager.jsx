'use client';
import { useState, useEffect } from 'react';
import ElectionForm from './ElectionForm';
import CandidateForm from './CandidateForm';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

export default function ElectionManager() {
  const [elections, setElections] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [addingCandidates, setAddingCandidates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadElections();
    
    // Set up SSE connection
    const eventSource = new EventSource('/api/elections/updates');
    
    eventSource.onmessage = (event) => {
      if (event.data === 'connected') return;
      
      const update = JSON.parse(event.data);
      // Reload elections data for any election-related update
      loadElections();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const loadElections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/elections');
      if (!response.ok) throw new Error('Failed to load elections');
      const data = await response.json();
      setElections(data.active_elections || []);
    } catch (error) {
      setError(error.message);
      console.error('Failed to load elections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/elections', {
        method: editingElection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        loadElections();
        setIsCreating(false);
        setEditingElection(null);
      }
    } catch (error) {
      console.error('Failed to save election:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this election?')) return;
    
    try {
      setActionLoading(id);
      const response = await fetch(`/api/elections/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadElections();
      }
    } catch (error) {
      console.error('Failed to delete election:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button
          onClick={loadElections}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isCreating || editingElection) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <ElectionForm
          election={editingElection}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsCreating(false);
            setEditingElection(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Active Elections
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Create New Election
        </button>
      </div>

      <div className="grid gap-6 custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {elections.map(election => (
          <div
            key={election.id}
            className="relative bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all duration-300 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-700"
            style={{
              backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%)'
            }}
          >
            <div className="flex justify-between items-start space-x-4">
              <div className="space-y-3 flex-1">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {election.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {election.description}
                </p>
                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm">
                      {new Date(election.timeline.startDate).toLocaleDateString()}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm">
                      {new Date(election.timeline.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-xs font-medium transform hover:scale-105 transition-transform ${election.status === 'active' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-yellow-200'}`}>
                {election.status}
              </span>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setEditingElection(election)}
                disabled={actionLoading === election.id}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:-translate-y-0.5 active:translate-y-0"
              >
                <FaEdit className="text-xs" /> <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDelete(election.id)}
                disabled={actionLoading === election.id}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400 rounded-lg hover:shadow-md transition-all duration-200 border border-red-200 dark:border-red-800/30 hover:-translate-y-0.5 active:translate-y-0 relative"
              >
                {actionLoading === election.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-500"></div>
                  </div>
                ) : (
                  <>
                    <FaTrash className="text-xs" /> <span>Delete</span>
                  </>
                )}
              </button>
            </div>
            {election.status === 'active' && (
              <div className="mt-4 py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Voting is currently in progress
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
