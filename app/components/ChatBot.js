"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaChevronRight } from 'react-icons/fa';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('/data/chatBot.json')
      .then(res => res.json())
      .then(data => setFaqData(data));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (question, answer) => {
    const userMessage = { type: 'user', text: question };
    const botResponse = { type: 'bot', text: answer };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setShowQuestions(false);
  };

  const handleNewQuestion = () => {
    setShowQuestions(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-96 mb-4 overflow-hidden border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Election Assistant</h3>
                  <p className="text-blue-100 text-sm">Ask me anything about elections</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>
            </div>
            
            {/* Chat area */}
            <div className="h-[500px] overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.length > 0 ? (
                <div className="space-y-6 mb-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        } shadow-md`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 my-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                  >
                    <FaRobot className="text-blue-500 dark:text-blue-400 text-2xl" />
                  </motion.div>
                  <h4 className="text-lg font-semibold mb-2">Welcome to Election Assistant!</h4>
                  <p className="text-sm">Choose a question below to get started</p>
                </div>
              )}

              {showQuestions && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="text-gray-600 dark:text-gray-300 mb-4 text-sm font-medium">
                    Frequently Asked Questions
                  </div>
                  {faqData.map((faq, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuestionClick(faq.question, faq.answer)}
                      className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center group border border-gray-100 dark:border-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-1 pr-4">
                        {faq.question}
                      </span>
                      <FaChevronRight className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {!showQuestions && messages.length > 0 && (
                <motion.button
                  onClick={handleNewQuestion}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Ask Another Question</span>
                  <FaChevronRight className="text-sm" />
                </motion.button>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <FaRobot size={24} />
      </motion.button>
    </div>
  );
}
