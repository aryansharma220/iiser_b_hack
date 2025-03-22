'use client';
import { useState } from 'react';

export default function CandidateForm({ position, onSubmit, onCancel }) {
  const [candidate, setCandidate] = useState({
    name: '',
    rollNumber: '',
    manifesto: '',
    agenda: [''],
    experience: '',
    achievements: ['']
  });

  const addAgendaItem = () => {
    setCandidate(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const addAchievement = () => {
    setCandidate(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-100 dark:border-gray-700">
      <h4 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">{position.title} Candidate Form</h4>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(candidate);
      }} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => setCandidate({...candidate, name: e.target.value})}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roll Number</label>
            <input
              type="text"
              value={candidate.rollNumber}
              onChange={(e) => setCandidate({...candidate, rollNumber: e.target.value})}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manifesto</label>
            <textarea
              value={candidate.manifesto}
              onChange={(e) => setCandidate({...candidate, manifesto: e.target.value})}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agenda Items</label>
              <button
                type="button"
                onClick={addAgendaItem}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
              >
                <span>Add Item</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {candidate.agenda.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newAgenda = [...candidate.agenda];
                    newAgenda[idx] = e.target.value;
                    setCandidate({...candidate, agenda: newAgenda});
                  }}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder={`Agenda item ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
            <textarea
              value={candidate.experience}
              onChange={(e) => setCandidate({...candidate, experience: e.target.value})}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 dark:text-gray-300 rounded-md text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Add Candidate
          </button>
        </div>
      </form>
    </div>
  );
}
