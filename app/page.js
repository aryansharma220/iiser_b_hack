"use client"
import Link from 'next/link';
import { FaVoteYea, FaUserShield, FaChartBar, FaLock, FaBars, FaTimes, FaMoon, FaSun, FaCheck, FaAngleRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-900/20 dark:to-indigo-900/20 blur-[100px] transform rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-[80%] -left-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-900/20 dark:to-pink-900/20 blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>
      
      {/* Header with glass morphism effect */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'py-2 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-md' : 'py-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6">
              CE
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 dark:group-hover:from-indigo-400 dark:group-hover:to-blue-400 transition-all duration-300">
              CampusElect
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link href="#features" className="nav-link dark:text-gray-300 dark:hover:text-white">Features</Link>
              <Link href="#about" className="nav-link dark:text-gray-300 dark:hover:text-white">About</Link>
              <Link href="#faq" className="nav-link dark:text-gray-300 dark:hover:text-white">FAQ</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={toggleDarkMode} 
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                aria-label="Toggle dark mode"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:hidden">
            <motion.button 
              onClick={toggleDarkMode} 
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              aria-label="Toggle dark mode"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
            </motion.button>
            <motion.button 
              className="text-2xl text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden transition-colors duration-300"
            >
              <div className="py-4 px-4 flex flex-col space-y-4">
                <Link href="#features" className="nav-link-mobile dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                <Link href="#about" className="nav-link-mobile dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link href="#faq" className="nav-link-mobile dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section with dynamic background and animation */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        {/* Hero background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 opacity-90 transition-colors duration-300"></div>
        
        <div className="absolute inset-0">
          <div className="wave-pattern"></div>
        </div>
        
        
        <div className="relative container mx-auto px-4 md:px-6 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="md:pr-6"
              >
                
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  <span className="block text-white opacity-90">Future-Ready</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 dark:from-yellow-200 dark:to-pink-200">Digital Democracy</span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-xl leading-relaxed">
                  Empower your student community with a secure, transparent, and 
                  <span className="relative inline-block px-2">
                    <span className="absolute inset-0 transform -skew-x-12 bg-white/20 rounded"></span>
                    <span className="relative">efficient</span>
                  </span> election experience.
                </p>
                <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center md:justify-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/login/voter" className="btn-hero-primary group">
                      Vote Now
                      <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block ml-2">→</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/login/faculty-admin" className="btn-hero-secondary">
                      Faculty Access
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/login/student-admin" className="btn-hero-secondary">
                      Student Admin Access
                    </Link>
                  </motion.div>
                </div>
                
                {/* Trust badges */}
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center md:justify-start space-x-8">
                  <div className="flex items-center text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                      <FaCheck className="text-green-400" />
                    </div>
                    <span>Secure Voting</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                      <FaCheck className="text-green-400" />
                    </div>
                    <span>Anonymous</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                      <FaCheck className="text-green-400" />
                    </div>
                    <span>Real-time</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                {/* Glowing spheres */}
                <div className="absolute -left-8 -top-8 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full filter blur-3xl opacity-30"></div>
                
                {/* Floating 3D card */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateZ: [0, 2, 0],
                    rotateX: [0, 2, 0],
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 transform perspective-1000"
                >
                  <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-2xl pointer-events-none"></div>
                  <div className="mb-6 pb-6 border-b border-white/20">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-xl font-bold">Election Dashboard</h3>
                      <div className="flex space-x-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-white/50"></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-blue-100 mt-2">Seamless voting experience for all</p>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { icon: <FaVoteYea />, label: "Voting Progress", percent: 27 },
                      { icon: <FaUserShield />, label: "Authenticated Users", percent: 54 },
                      { icon: <FaChartBar />, label: "Results Processed", percent: 81 }
                    ].map((item, i) => (
                      <div key={i} className="relative">
                        <div className="flex items-center text-white text-sm mb-2 justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <span className="font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                            className="h-2 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 40C480 40 600 20 720 20C840 20 960 40 1080 43.3C1200 46.7 1320 33.3 1380 26.7L1440 20V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V0Z" className="fill-white dark:fill-gray-900 transition-colors duration-300"/>
          </svg>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 relative transition-colors duration-300">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-transparent rounded-full filter blur-3xl opacity-70 dark:opacity-40 -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                POWERFUL FEATURES
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Modern Election System Built for <span className="text-blue-600 dark:text-blue-400">Students</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our platform combines security, efficiency, and user experience to deliver the ultimate election process.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaVoteYea className="text-3xl text-white" />,
                title: "Seamless Voting",
                description: "Easy and intuitive voting experience with personalized ballots based on your eligibility",
                color: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
              },
              {
                icon: <FaUserShield className="text-3xl text-white" />,
                title: "Secure Authentication",
                description: "Unique passkeys and OTP verification ensure only eligible students can vote",
                color: "from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700"
              },
              {
                icon: <FaChartBar className="text-3xl text-white" />,
                title: "Real-time Results",
                description: "Track election progress and view results as they happen with beautiful visualizations",
                color: "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700"
              },
              {
                icon: <FaLock className="text-3xl text-white" />,
                title: "Anonymous Voting",
                description: "Your privacy is protected - votes are recorded anonymously with advanced encryption",
                color: "from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedFeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradientClass={feature.color}
                  darkMode={darkMode}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Election Information */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900 relative transition-colors duration-300">
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/30 to-transparent rounded-full filter blur-3xl opacity-70 dark:opacity-40 -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                ELECTION STRUCTURE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Comprehensive Election <span className="text-blue-600 dark:text-blue-400">System</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Designed for all student representative positions across different academic years.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800/50 rounded-2xl transform rotate-1 scale-105 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50 transition-colors duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 4a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 110-2h3V5a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Representative Positions
                  </h3>
                  <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    {[
                      "Class Representatives (CRs) for each stream and year",
                      "Department Representatives (DRs) for 3rd-5th year students",
                      "Mess Representatives (2 positions)",
                      "Hostel Representatives (2 for Girls, 2 for Boys)"
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start rounded-lg p-3 transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        whileHover={{ x: 5 }}
                      >
                        <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-800/50 rounded-2xl transform -rotate-1 scale-105 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900/50 transition-colors duration-300">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm0-9a1 1 0 10-2 0v5a1 1 0 102 0V5z" clipRule="evenodd" />
                      </svg>
                    </span>
                    How it Works
                  </h3>
                  <ol className="space-y-4 relative pl-6 ml-3 mb-5">
                    {[
                      "Receive your unique passkey via email",
                      "Log in to the voter portal using your credentials",
                      "Verify your identity with OTP authentication",
                      "View positions you're eligible to vote for",
                      "Cast your vote securely and anonymously",
                      "Receive confirmation of your successful submission"
                    ].map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="relative"
                        whileHover={{ x: 5 }}
                      >
                        <div className="absolute -left-[30px] mt-4 w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <div className="bg-white dark:bg-gray-800 ml-4 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800 hover:shadow-md transition">
                          {item}
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                FAQs
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to know about the election process.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I get my voting passkey?",
                answer: "Your unique voting passkey will be sent to your registered college email address once the election is scheduled."
              },
              {
                question: "What happens if I lose my passkey?",
                answer: "You can request a new passkey through the 'Forgot Passkey' option on the voter login page. A new passkey will be sent to your email after verification."
              },
              {
                question: "Can I change my vote after submission?",
                answer: "No, once your vote is submitted, it cannot be changed. Please review your choices carefully before final submission."
              },
              {
                question: "How is my vote kept anonymous?",
                answer: "After authentication, your identity is separated from your voting choices. The system only records that you voted, but not what choices you made."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition group hover:bg-gradient-to-r hover:from-white hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-blue-900/20"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 transform group-hover:rotate-12 transition-transform">
                    <FaAngleRight />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-14">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 opacity-90 transition-colors duration-300"></div>
        
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="relative container mx-auto px-4 md:px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Your participation matters. Help shape the future of our college community by voting for your representatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login/voter" className="btn-cta-primary">
                  Access Voter Portal
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 dark:text-gray-500 py-10 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm"
                >
                  CE
                </motion.div>
                <h2 className="text-xl font-bold text-white dark:text-gray-100">CampusElect</h2>
              </div>
              <p className="text-sm">Secure. Fair. Transparent.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CampusElect - College Election System. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <ChatBot />
    </div>
  );
}

function EnhancedFeatureCard({ icon, title, description, gradientClass, darkMode, index }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition h-full flex flex-col overflow-hidden relative"
    >
      {/* Corner accent */}
      <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-bl-3xl transform rotate-12 group-hover:rotate-6 transition-transform duration-300 z-0"></div>
      
      {/* Top colored section with icon */}
      <div className={`relative z-10 bg-gradient-to-r ${gradientClass} -mx-6 -mt-6 mb-6 p-6 flex items-center justify-center w-20 h-20 rounded-br-xl shadow-md transform group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 flex-1">{description}</p>
      
      {/* Bottom accent */}
      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
      
      {/* Badge */}
      <div className="absolute top-4 right-4 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full z-10">
        {`0${index + 1}`}
      </div>
      
      {/* Pseudo-element for hover effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </motion.div>
  );
}
