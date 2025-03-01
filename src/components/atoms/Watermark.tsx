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
      
      <div className="text-xs flex items-center">
        <span className="text-gray-400">&copy; {currentYear} DevFerreiraG</span>
        <span className="mx-2 text-gray-400">|</span>
        <a 
          href="https://linkedin.com/in/DevFerreiraG" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition-colors flex items-center"
          title="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        <span className="mx-2 text-gray-400">|</span>
        <a 
          href="https://github.com/FuturoDevJunior/FlowchartG" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition-colors flex items-center"
          title="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.8-.3-5.6-1.3-5.6-6 0-1.2.5-2.3 1.3-3.1-.1-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17 6.7 18 7 18 7c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.9 5.6-5.6 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 0z"/>
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default Watermark;