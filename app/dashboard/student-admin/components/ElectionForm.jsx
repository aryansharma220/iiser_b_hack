'use client';
import { useState } from 'react';

export default function ElectionForm({ election, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(election || {
    title: '',
    description: '',
    eligibility: { yearOfStudy: [], stream: '' },
    positions: [],
    timeline: {
      startDate: '',
      endDate: '',
      resultDate: '',
      minVotingDuration: '24h'
    },
    validation: {
      requireAllPositions: true,
      allowRevote: false,
      requireConfirmation: true
    },
    rules: []
  });

  const addPosition = () => {
    setFormData(prev => ({
      ...prev,
      positions: [...prev.positions, {
        id: `pos_${Date.now()}`,
        title: '',
        maxSelections: 1,
        candidates: []
      }]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        {election ? 'Edit Election' : 'Create New Election'}
      </h3>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }} className="space-y-6">
        <div className="space-y-4">
          <div className="transition-all duration-200 hover:transform hover:translate-x-1">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
              required
            />
          </div>

          <div className="transition-all duration-200 hover:transform hover:translate-x-1">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
              rows={3}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="transition-all duration-200 hover:transform hover:translate-x-1">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">Start Date</label>
            <input
              type="datetime-local"
              value={formData.timeline.startDate.split('Z')[0]}
              onChange={(e) => setFormData({
                ...formData,
                timeline: {...formData.timeline, startDate: e.target.value}
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
              required
            />
          </div>
          <div className="transition-all duration-200 hover:transform hover:translate-x-1">
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">End Date</label>
            <input
              type="datetime-local"
              value={formData.timeline.endDate.split('Z')[0]}
              onChange={(e) => setFormData({
                ...formData,
                timeline: {...formData.timeline, endDate: e.target.value}
              })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-medium text-gray-800 dark:text-white">Positions</h4>
            <button
              type="button"
              onClick={addPosition}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Position
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.positions.map((position, idx) => (
              <div key={position.id} className="p-5 border border-gray-100 dark:border-gray-700 rounded-lg transition-all duration-200 hover:border-blue-500 hover:shadow-sm">
                <input
                  type="text"
                  value={position.title}
                  onChange={(e) => {
                    const newPositions = [...formData.positions];
                    newPositions[idx].title = e.target.value;
                    setFormData({...formData, positions: newPositions});
                  }}
                  placeholder="Position Title"
                  className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                />
                <input
                  type="number"
                  value={position.maxSelections}
                  onChange={(e) => {
                    const newPositions = [...formData.positions];
                    newPositions[idx].maxSelections = parseInt(e.target.value);
                    setFormData({...formData, positions: newPositions});
                  }}
                  placeholder="Max Selections"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {election ? 'Update Election' : 'Create Election'}
          </button>
        </div>
      </form>
    </div>
  );
}
