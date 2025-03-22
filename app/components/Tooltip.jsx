'use client';
import { useState } from 'react';

export function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-10 left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-xs font-medium
          text-white bg-gray-900 dark:bg-gray-700
          rounded shadow-lg pointer-events-none
          whitespace-nowrap
          transition-opacity duration-200
          ${positionClasses[position]}
        `}>
          <div className="relative">
            {content}
            <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45
              -bottom-4 left-1/2 -translate-x-1/2"
            />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
