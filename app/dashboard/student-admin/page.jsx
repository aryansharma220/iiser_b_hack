'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaSignOutAlt, FaUserCircle, FaSun, FaMoon,
  FaVoteYea, FaUserFriends, FaBell, FaChartBar
} from 'react-icons/fa';
import ElectionManager from './components/ElectionManager';
import CandidateManager from './components/CandidateManager';
import ResultsManager from './components/ResultsManager';
import NotificationManager from './components/NotificationManager';

function StudentAdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('elections');

  useEffect(() => {
    const adminData = localStorage.getItem('studentAdmin');
    if (!adminData) {
      router.push('/login/student-admin');
      return;
    }
    setAdmin(JSON.parse(adminData));

    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('studentAdmin');
    router.push('/login/student-admin');
  };

  const menuItems = [
    {
      id: 'elections',
      title: 'Manage Elections',
      icon: <FaVoteYea />,
      permission: 'manage_elections'
    },
    {
      id: 'candidates',
      title: 'Manage Candidates',
      icon: <FaUserFriends />,
      permission: 'manage_candidates'
    },
    {
      id: 'results',
      title: 'View Results',
      icon: <FaChartBar />,
      permission: 'view_results'
    },
    {
      id: 'notifications',
      title: 'Send Notifications',
      icon: <FaBell />,
      permission: 'send_notifications'
    }
  ];

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-default">
                Student Admin Portal
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleDarkMode} 
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              >
                {darkMode ? 
                  <FaSun className="text-yellow-400 w-5 h-5" /> : 
                  <FaMoon className="text-blue-600 w-5 h-5" />
                }
              </button>
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600">
                <FaUserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">{admin.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {menuItems.map(item => (
                  admin?.permissions.includes(item.permission) && (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3.5 rounded-lg transition-all duration-200 hover:scale-[1.02]
                        ${activeSection === item.id 
                          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-md' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700">
              <div className="animate-fadeIn">
                {activeSection === 'elections' && <ElectionManager />}
                {activeSection === 'candidates' && <CandidateManager />}
                {activeSection === 'results' && <ResultsManager />}
                {activeSection === 'notifications' && <NotificationManager />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAdminDashboard;
