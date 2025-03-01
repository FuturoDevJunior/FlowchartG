import React from 'react';

const Watermark: React.FC = () => {
  return (
    <a
      href="https://linkedin.com/in/DevFerreiraG"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center text-xs text-[#00FF88] opacity-80 hover:opacity-100 transition-opacity"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1 animate-pulse"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="#00FF88"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Feito por DevFerreiraG
    </a>
  );
};

export default Watermark;