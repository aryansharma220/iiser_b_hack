'use client';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';

export default function NotificationManager() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [notificationType, setNotificationType] = useState('reminder');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setElections(data.active_elections || []);
    } catch (error) {
      console.error('Failed to load elections:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!selectedElection) return;
    
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId: selectedElection,
          type: notificationType,
          customMessage: message
        })
      });

      const data = await response.json();
      setFeedback({
        type: response.ok ? 'success' : 'error',
        message: response.ok ? 'Notifications sent successfully!' : data.error
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to send notifications'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
        Send Notifications
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Select Election
          </label>
          <select
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600"
            onChange={(e) => setSelectedElection(e.target.value)}
            value={selectedElection || ''}
          >
            <option value="">Select an election</option>
            {elections.map(election => (
              <option key={election.id} value={election.id}>
                {election.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Notification Type
          </label>
          <div className="space-y-3">
            {[
              { value: 'reminder', label: 'Election Reminder to Eligible Voters' },
              { value: 'results', label: 'Results Announcement' }
            ].map((type) => (
              <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <input
                  type="radio"
                  value={type.value}
                  checked={notificationType === type.value}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-200">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Additional Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600"
            rows={4}
            placeholder="Enter any additional message to include in the email..."
          />
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg border ${
            feedback.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900' 
              : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900'
          }`}>
            {feedback.message}
          </div>
        )}

        <button
          onClick={handleSendNotification}
          disabled={!selectedElection || isLoading}
          className={`flex items-center justify-center space-x-2 w-full p-3 rounded-lg
            transform transition-all duration-200 
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg active:scale-98'} 
            text-white font-medium`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <FaEnvelope />
              <span>Send Notifications</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
