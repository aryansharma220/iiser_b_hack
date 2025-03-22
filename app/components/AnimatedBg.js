'use client'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBg({ 
  children, 
  particleCount = 15, 
  className = "", 
  particleColor = "bg-white", 
  particleOpacity = "opacity-30"
}) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // 2-8px
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    
    setParticles(newParticles);
  }, [particleCount]);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particleColor} ${particleOpacity}`}
          style={{
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
      {children}
    </div>
  );
}
