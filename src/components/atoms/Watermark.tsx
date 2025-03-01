import React from 'react';

/**
 * Professional watermark component with improved styling and branding
 */
const Watermark: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-3 bg-blue-500 p-1 rounded">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <div>
          <div className="font-semibold tracking-wide">FlowchartG</div>
          <div className="text-xs text-gray-400">v1.0.0 - Professional Edition</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-400">
        <span>&copy; {currentYear} DevFerreiraG</span>
        <span className="hidden sm:inline-block mx-2">|</span>
        <a 
          href="https://github.com/FuturoDevJunior/FlowchartG" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:inline-block hover:text-blue-300 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Watermark;