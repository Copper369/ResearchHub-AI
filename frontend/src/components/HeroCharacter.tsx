import React, { useState, useEffect, useRef } from 'react';

const HeroCharacter: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateGaze = () => {
    if (!containerRef.current) return { rotateX: 0, rotateY: 0, eyeX: 0, eyeY: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(1, Math.hypot(dx, dy) / 400);

    // Head rotation limits
    const rotateY = (dx / window.innerWidth) * 30; // Max 30 deg
    const rotateX = -(dy / window.innerHeight) * 20; // Max 20 deg

    // Eye movement limits
    const eyeX = Math.cos(angle) * distance * 8;
    const eyeY = Math.sin(angle) * distance * 5;

    return { rotateX, rotateY, eyeX, eyeY };
  };

  const gaze = calculateGaze();

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] flex items-center justify-center pointer-events-none perspective-1000"
    >
      {/* Character Group */}
      <div 
        className="relative transition-transform duration-300 ease-out preserve-3d"
        style={{
          transform: `rotateX(${gaze.rotateX}deg) rotateY(${gaze.rotateY}deg)`
        }}
      >
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

        {/* The Cyber-Humanoid Figure */}
        <svg
          width="400"
          height="500"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-2xl"
        >
          {/* Main Body / Chest Piece */}
          <path
            d="M100 450C100 400 130 360 200 360C270 360 300 400 300 450V500H100V450Z"
            fill="url(#bodyGradient)"
            className="opacity-90"
          />
          <path
            d="M120 460L200 410L280 460"
            stroke="#645efb"
            strokeWidth="2"
            strokeOpacity="0.3"
          />

          {/* Neck Module */}
          <rect x="180" y="320" width="40" height="50" rx="10" fill="#2d2b55" />
          <path d="M185 330H215" stroke="#53ddfc" strokeWidth="1" strokeOpacity="0.4" />

          {/* Head / Helmet Base */}
          <path
            d="M110 200C110 120 150 80 200 80C250 80 290 120 290 200C290 280 250 320 200 320C150 320 110 280 110 200Z"
            fill="url(#headGradient)"
            stroke="#ffffff20"
            strokeWidth="1"
          />

          {/* Glass Visor */}
          <path
            d="M125 180C125 150 150 125 200 125C250 125 275 150 275 180V220C275 250 250 275 200 275C150 275 125 250 125 220V180Z"
            fill="url(#visorGradient)"
            fillOpacity="0.4"
            stroke="white"
            strokeOpacity="0.2"
          />

          {/* Moving Eyes */}
          <g style={{ transform: `translate(${gaze.eyeX}px, ${gaze.eyeY}px)` }}>
            {/* Left Eye */}
            <circle cx="165" cy="190" r="10" fill="#645efb" fillOpacity="0.2" />
            <circle cx="165" cy="190" r="5" fill="#53ddfc">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            
            {/* Right Eye */}
            <circle cx="235" cy="190" r="10" fill="#645efb" fillOpacity="0.2" />
            <circle cx="235" cy="190" r="5" fill="#53ddfc">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Decorative Head Details */}
          <path d="M200 80V100" stroke="#53ddfc" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M140 100C160 85 240 85 260 100" stroke="#645efb" strokeWidth="1" strokeOpacity="0.3" />

          {/* Definitions */}
          <defs>
            <linearGradient id="bodyGradient" x1="200" y1="360" x2="200" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e1b4b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="headGradient" x1="200" y1="80" x2="200" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e1b4b" />
              <stop offset="1" stopColor="#2d2b55" />
            </linearGradient>
            <linearGradient id="visorGradient" x1="200" y1="125" x2="200" y2="275" gradientUnits="userSpaceOnUse">
              <stop stopColor="#645efb" />
              <stop offset="1" stopColor="#53ddfc" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting UI Elements around the character */}
        <div className="absolute -top-10 -right-10 w-20 h-20 border border-secondary/20 rounded-lg animate-spin duration-[15000ms] opacity-40"></div>
        <div className="absolute top-20 -left-20 w-16 h-16 border-2 border-primary/20 rounded-full animate-pulse opacity-30"></div>
      </div>
    </div>
  );
};

export default HeroCharacter;
