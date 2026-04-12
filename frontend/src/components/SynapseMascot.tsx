import React, { useState, useEffect, useRef } from 'react';

const SynapseMascot: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateGaze = () => {
    if (!mascotRef.current) return { x: 0, y: 0, rotate: 0 };

    const rect = mascotRef.current.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(position.y - mascotCenterY, position.x - mascotCenterX);
    
    // Limits for pupil movement
    const distance = Math.min(15, Math.hypot(position.x - mascotCenterX, position.y - mascotCenterY) / 20);
    const pupilX = Math.cos(angle) * distance;
    const pupilY = Math.sin(angle) * distance;

    return { x: pupilX, y: pupilY, rotate: angle * (180 / Math.PI) };
  };

  const gaze = calculateGaze();

  return (
    <div 
      ref={mascotRef}
      className="fixed bottom-12 right-12 z-50 pointer-events-none group"
    >
      {/* Floating Base */}
      <div className="relative w-32 h-32 flex items-center justify-center animate-bounce duration-[4000ms] ease-in-out">
        
        {/* Halo Effects */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute inset-4 bg-secondary/10 rounded-full blur-xl"></div>

        {/* Outer Orb (Glassmorphic) */}
        <div className="relative w-24 h-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110">
          
          {/* Inner Glowing Eye Container */}
          <div 
            className="relative w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center shadow-inner"
            style={{
              transform: `translate(${gaze.x}px, ${gaze.y}px)`
            }}
          >
            {/* The Pupil / Core */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dim relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
              {/* Eye Glow */}
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-pulse"></div>
            </div>
          </div>

          {/* Glare effect on the orb */}
          <div className="absolute top-2 left-6 w-8 h-4 bg-white/10 rounded-full rotate-[-45deg]"></div>
        </div>

        {/* Small Data Nodes Orbiting */}
        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(83,221,252,0.6)] animate-spin duration-[8000ms]"></div>
        <div className="absolute bottom-2 left-0 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(100,94,251,0.6)] animate-spin duration-[12000ms]"></div>
      </div>

      {/* Label (Optional) */}
      <div className="mt-4 text-center">
        <span className="px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30 text-[9px] font-label font-bold text-on-surface-variant uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Neural Assistant Active</span>
      </div>
    </div>
  );
};

export default SynapseMascot;
