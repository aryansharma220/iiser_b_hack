"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import studentAdmins from '../../../lib/student-admin.json';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [studentAdminList, setStudentAdminList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    permissions: ['manage_candidates', 'view_results']
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('facultyAdmin');
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    if (!adminData) {
      router.push('/login/faculty-admin');
      return;
    }

    const parsedData = JSON.parse(adminData);

    if (parsedData.role !== 'faculty_super_admin') {
      router.push('/login/faculty-admin');
      return;
    }

    setAdmin(parsedData);

    setStudentAdminList(studentAdmins);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('facultyAdmin');
    router.push('/login/faculty-admin');
  };

  const handleAddNewAdmin = () => {
    try {
      const newAdmin = {
        id: `A${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ID
        role: 'student_admin',
        assignedBy: admin.email,
        assignedDate: new Date().toISOString().split('T')[0],
        ...newAdminData
      };

      const updatedAdminList = [...studentAdminList, newAdmin];
      setStudentAdminList(updatedAdminList);
      localStorage.setItem('studentAdmins', JSON.stringify(updatedAdminList));
      setIsAddModalOpen(false);
      setNewAdminData({
        name: '',
        email: '',
        department: '',
        year: '',
        permissions: ['manage_candidates', 'view_results']
      });
    } catch (error) {
      console.error('Error adding new admin:', error);
    }
  };

  const handleRevoke = async (adminId) => {
    if (window.confirm('Are you sure you want to revoke this admin\'s access?')) {
      try {
        const updatedAdminList = studentAdminList.filter(admin => admin.id !== adminId);

        setStudentAdminList(updatedAdminList);
        localStorage.setItem('studentAdmins', JSON.stringify(updatedAdminList));
      } catch (error) {
        console.error('Error revoking admin:', error);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  if (!admin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-purple-50'
    }`}>
      <nav className={`relative ${
        darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/70 border-gray-200'
      } backdrop-blur-xl border-b p-4 shadow-md transition-colors duration-300`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">Election Admin Portal</div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <span className={darkMode ? 'text-indigo-400' : 'text-indigo-700'}>Welcome, {admin.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold relative ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Super Admin Dashboard
            <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            Add New Admin
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80' 
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-xl p-6 rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-xl mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Student Admins
              </h3>
              <div className={`p-2 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} rounded-lg`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {studentAdminList.length} active admins
            </p>
          </div>
          <div className={`${
            darkMode 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80' 
              : 'bg-white/80 border-gray-200'
          } backdrop-blur-xl p-6 rounded-xl border shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-xl mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                System Status
              </h3>
              <div className={`p-2 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'} rounded-lg`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className={`${darkMode ? 'text-green-400' : 'text-green-600'} font-medium mt-2`}>
              System Online
            </p>
          </div>
        </div>

        <div className={`${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        } backdrop-blur-xl rounded-xl border shadow-lg transition-colors duration-300`}>
          <div className={`px-6 py-4 border-b ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50' 
              : 'border-gray-200 bg-gradient-to-r from-gray-50/50 to-transparent'
          }`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Manage Student Admins
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead>
                  <tr className={darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-indigo-400' : 'text-purple-300'
                    }`}>ID</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Name</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Department</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Role</th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {studentAdminList.map((studentAdmin, index) => (
                    <tr key={studentAdmin.id} className={`${
                      darkMode 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-indigo-50/50'
                    } transition-colors duration-200`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{studentAdmin.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{studentAdmin.name[0]}</span>
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{studentAdmin.name}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{studentAdmin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{studentAdmin.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 shadow-sm">
                          {studentAdmin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleRevoke(studentAdmin.id)}
                          className="group bg-red-500/10 text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
                        >
                          <span>Revoke Access</span>
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className={`${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            } backdrop-blur-xl p-6 rounded-xl border w-full max-w-md shadow-2xl`}>
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Add New Student Admin
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
                        : 'bg-white border-gray-200 text-gray-800'
                    } border focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
                        : 'bg-white border-gray-200 text-gray-800'
                    } border focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                    placeholder="Enter college email"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={newAdminData.department}
                    onChange={(e) => setNewAdminData({...newAdminData, department: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
                        : 'bg-white border-gray-200 text-gray-800'
                    } border focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Year
                  </label>
                  <select
                    value={newAdminData.year}
                    onChange={(e) => setNewAdminData({...newAdminData, year: parseInt(e.target.value)})}
                    className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
                        : 'bg-white border-gray-200 text-gray-800'
                    } border focus:ring-2 focus:ring-indigo-500/20 outline-none`}
                  >
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5].map(year => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewAdmin}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
