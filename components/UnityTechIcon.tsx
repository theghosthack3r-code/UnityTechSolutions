import React from 'react';

const UnityTechIcon: React.FC<{ className?: string }> = ({ className }) => {
  const infinityPath = "M23,23C3,43,46,46,46,23S89,3,69,23C49,43,3,3,23,23Z";

  return (
    <svg 
      className={className} 
      viewBox="0 0 92 46" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="uts-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.2" stopColor="#333" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <clipPath id="blue-mask">
          {/* This shape covers the left loop and the bottom-right part of the ribbon */}
          <path d="M0,0 H46 V46 H0 Z M46,23 L92,46 V23 L46,0 Z" />
        </clipPath>
      </defs>
      
      {/* Layer 1: The black gradient background shape */}
      <path d={infinityPath} fill="url(#uts-gradient)" />

      {/* Layer 2: The blue shape, clipped to appear "on top" in the right places */}
      <path d={infinityPath} fill="#1976ff" clipPath="url(#blue-mask)" />
    </svg>
  );
};

export default UnityTechIcon;
