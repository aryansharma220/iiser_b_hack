'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUser, FaEnvelope, FaSun, FaMoon, FaIdCard } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import voters from '../../../lib/voter.json';

export default function VoterLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [storedPasskey, setStoredPasskey] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const validateEmail = (email) => {
    if (!email.endsWith('@college.edu')) {
      throw new Error('Please use your college email address (@college.edu)');
    }
    const voter = voters.find(v => v.email === email);
    if (!voter) {
      throw new Error('Email not found in voter database');
    }
    return voter;
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !rollNumber) {
        throw new Error('All fields are required');
      }

      // Validate email and get voter data
      const voter = validateEmail(email);

      // Validate roll number
      if (voter.rollNumber !== rollNumber) {
        throw new Error('Invalid roll number');
      }

      const response = await fetch('/api/auth/send-passkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rollNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send passkey');
      }

      setStoredPasskey(data.passkey);
      setShowPasskey(true);
    } catch (err) {
      setError(err.message);
      console.error('Login Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!passkey) {
        throw new Error('Please enter the passkey');
      }

      if (passkey !== storedPasskey) {
        throw new Error('Invalid passkey. Please check and try again.');
      }

      const voter = voters.find(v => v.email === email);
      
      if (!voter) {
        throw new Error('Voter data not found');
      }

      const voterData = {
        email,
        rollNumber,
        name: voter.name,
        authenticated: true,
        timestamp: Date.now()
      };

      console.log('Storing voter data:', voterData);
      localStorage.setItem('voter', JSON.stringify(voterData));

      router.push('/dashboard/voter');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-100/30 via-indigo-200/30 to-purple-200/30 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 blur-[100px] transform rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-[60%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100/30 via-pink-200/30 to-orange-200/30 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-orange-900/20 blur-[80px] animate-pulse-slow delay-1000"></div>
      </div>

      {/* Enhanced theme toggle button */}
      <motion.button 
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 w-14 h-14 rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:shadow-xl transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: darkMode ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative"
        >
          {darkMode ? (
            <FaSun className="text-amber-400 text-xl transform transition-all duration-300 hover:text-amber-300" />
          ) : (
            <FaMoon className="text-blue-600 text-xl transform transition-all duration-300 hover:text-blue-500" />
          )}
        </motion.div>
      </motion.button>

      {/* Enhanced logo */}
      <Link href="/" className="fixed top-6 left-6 flex items-center space-x-3 group z-10">
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          CE
        </motion.div>
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          CampusElect
        </h1>
      </Link>

      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-8 pt-12 pb-10">
              {/* Enhanced header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl mb-8"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaUser className="text-white text-4xl" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Access your voting portal</p>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg mb-6"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293-1.293a1 1 00-1.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {!showPasskey ? (
                // Initial login form
                <form onSubmit={handleInitialSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-800 dark:text-white"
                          placeholder="your.email@college.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Roll Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          id="rollNumber"
                          type="text"
                          required
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your roll number"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-medium text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 transition-all duration-200"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Passkey...
                      </div>
                    ) : (
                      'Get Passkey'
                    )}
                  </motion.button>
                </form>
              ) : (
                // Passkey verification form
                <form onSubmit={handlePasskeySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enter Passkey
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={passkey}
                        onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                        className="block w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-center text-2xl tracking-widest"
                        placeholder="XXXXXX"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                  >
                    {loading ? 'Verifying...' : 'Verify Passkey'
                    }
                  </button>
                </form>
              )}

              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 text-base">
                      Other login options
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/login/student-admin" className="block w-full py-3 px-4 rounded-xl text-center font-medium bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      Student Admin
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/login/faculty-admin" className="block w-full py-3 px-4 rounded-xl text-center font-medium bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      Faculty Admin
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
