"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import facultyAdmins from '../../../lib/faculty-admin.json';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaLock, FaUser, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
// import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';  
// import { auth } from '@/lib/firebase';

function FacultyAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const router = useRouter();
  // const [signInWithEmailAndPassword, user, signInLoading, signInError] = useSignInWithEmailAndPassword(auth);

  // Enhanced dark mode effect with smooth transition
  useEffect(() => {
    // Add transition class to html element
    document.documentElement.classList.add('transition-colors', 'duration-300', 'ease-in-out');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
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

  // Enhanced dark mode toggle with visual feedback
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    // Add ripple effect class temporarily
    const button = document.querySelector('#theme-toggle');
    button?.classList.add('animate-ripple');
    setTimeout(() => {
      button?.classList.remove('animate-ripple');
    }, 500);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      return 'Email is required';
    }
    if (!regex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (!email.toLowerCase().endsWith('.edu')) {
      return 'Please use an educational email address (.edu)';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationFn = field === 'email' ? validateEmail : validatePassword;
    const value = field === 'email' ? email : password;
    setErrors(prev => ({ ...prev, [field]: validationFn(value) }));
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
    
    if (touched[field]) {
      const validationFn = field === 'email' ? validateEmail : validatePassword;
      setErrors(prev => ({ ...prev, [field]: validationFn(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ email: '', password: '', general: '' });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        general: ''
      });
      setLoading(false);
      return;
    }

    try {
      // In a real application, this would be an API call
      // For demo purposes, we're using the local JSON data
      const admin = facultyAdmins.find(admin => 
        admin.email === email && admin.password === password
      );
      
      if (!admin) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }

      // Store admin info in local storage or session
      localStorage.setItem('facultyAdmin', JSON.stringify({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }));

      // Redirect based on role
      if (admin.role === 'faculty_super_admin') {
        router.push('/dashboard/super-admin');
      } else {
        router.push('/dashboard/faculty-admin');
      }
      
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
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
        id="theme-toggle"
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
        <div className="absolute inset-0 dark:bg-gray-700/50 bg-gray-200/50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
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
          {/* Enhanced card design */}
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
                <p className="text-gray-600 dark:text-gray-300 text-lg">Access your administration portal</p>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293-1.293a1 1 00-1.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className={`h-5 w-5 ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => handleChange(e, 'email')}
                        onBlur={() => handleBlur('email')}
                        className={`block w-full pl-10 px-4 py-3 border ${
                          errors.email && touched.email 
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-xl shadow-sm dark:bg-gray-800 dark:text-white transition-colors duration-200`}
                        placeholder="example@college.edu"
                      />
                      {errors.email && touched.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={`h-5 w-5 ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => handleChange(e, 'password')}
                        onBlur={() => handleBlur('password')}
                        className={`block w-full pl-10 px-4 py-3 border ${
                          errors.password && touched.password 
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } rounded-xl shadow-sm dark:bg-gray-800 dark:text-white transition-colors duration-200`}
                      />
                      {errors.password && touched.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Forgot your password?
                    </a>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-medium text-white shadow-lg ${
                      loading 
                        ? 'bg-indigo-400 dark:bg-indigo-500' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500'
                    }`}
                    whileHover={{ scale: 1.02, translateY: -2 }}
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
                    ) : 'Sign in'}
                  </motion.button>
                </motion.div>
              </form>
              
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
                    <Link href="/login/student-admin" className="block w-full py-3 px-4 rounded-xl text-center font-medium bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                      Student Admin
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


export default FacultyAdminLogin;
