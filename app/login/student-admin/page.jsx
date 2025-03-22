'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import studentAdmins from '../../../lib/student-admin.json';

function StudentAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [validatedAdmin, setValidatedAdmin] = useState(null);
  const [otpError, setOtpError] = useState('');

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

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (adminEmail) => {
    try {
      const generatedOTP = generateOTP();
      localStorage.setItem('currentOTP', generatedOTP);
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminEmail,
          otp: generatedOTP
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      return true;
    } catch (error) {
      console.error('Detailed error:', error);
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const admin = studentAdmins.find(admin => 
        admin.email === email && admin.password === password
      );

      if (!admin) {
        throw new Error('Invalid email or password');
      }

      setValidatedAdmin(admin);
      await sendOTP(admin.email);
      setShowOTP(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');

    try {
      const storedOTP = localStorage.getItem('currentOTP');
      
      if (otp !== storedOTP) {
        throw new Error('Invalid OTP');
      }

      localStorage.removeItem('currentOTP');

      localStorage.setItem('studentAdmin', JSON.stringify({
        id: validatedAdmin.id,
        name: validatedAdmin.name,
        email: validatedAdmin.email,
        role: validatedAdmin.role,
        permissions: validatedAdmin.permissions,
        department: validatedAdmin.department
      }));

      router.push('/dashboard/student-admin');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-100/30 via-pink-200/30 to-indigo-200/30 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 blur-[100px] transform rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-[60%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-100/30 via-rose-200/30 to-purple-200/30 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-purple-900/20 blur-[80px] animate-pulse-slow delay-1000"></div>
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
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          CE
        </motion.div>
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
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
                  className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-600 shadow-xl mb-8"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FaUser className="text-white text-4xl" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Access your administration portal</p>
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
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293-1.293a1 1 00-1.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {!showOTP ? (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-800 dark:text-white"
                          placeholder="example@college.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-purple-600 hover:text-purple-500 dark:text-pink-400 dark:hover:text-pink-300">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  {otpError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6"
                    >
                      <p>{otpError}</p>
                    </motion.div>
                  )}

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        className="block w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-800 dark:text-white"
                        placeholder="Enter 6-digit OTP"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </motion.button>
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
                    <Link href="/login/voter" className="block w-full py-3 px-4 rounded-xl text-center font-medium bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      Student Login
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

export default StudentAdminLogin;
