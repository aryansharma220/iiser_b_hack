'use client'
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = "", 
  animate = true,
  hoverEffect = true
}) {
  const cardProps = {
    className: `relative bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-8 ${className}`,
  };

  // Add light reflection effect
  const lightReflection = (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-2xl pointer-events-none"></div>
  );

  if (animate) {
    return (
      <motion.div
        {...cardProps}
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
        whileHover={hoverEffect ? { scale: 1.03, y: -5 } : {}}
        className={`transform perspective-1000 ${cardProps.className}`}
      >
        {lightReflection}
        {children}
      </motion.div>
    );
  }
  
  return (
    <div {...cardProps}>
      {lightReflection}
      {children}
    </div>
  );
}
