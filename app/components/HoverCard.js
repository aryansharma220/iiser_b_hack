'use client'
import { motion } from 'framer-motion';

export default function HoverCard({ 
  children, 
  className = "", 
  gradientBg = false,
  rotate = true
}) {
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
    >
      {rotate && (
        <div className={`absolute inset-0 ${gradientBg ? 'bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-800/50 dark:to-blue-900/30' : 'bg-blue-200 dark:bg-blue-800/50'} rounded-2xl transform rotate-1 scale-105 group-hover:rotate-2 transition-transform duration-300`}></div>
      )}
      <div className={`relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg ${className} transition-all duration-300 group-hover:shadow-xl`}>
        {children}
      </div>
    </motion.div>
  );
}
