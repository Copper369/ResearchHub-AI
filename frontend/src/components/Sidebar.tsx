import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isActive) {
      return "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary border-r-2 border-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-all";
    }
    return "flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/50 transition-all duration-300 font-label text-[10px] uppercase tracking-[0.2em]";
  };

  return (
    <nav className="fixed left-0 top-0 h-full flex flex-col py-8 bg-surface-container-low/60 backdrop-blur-2xl w-64 border-r border-outline-variant/10 z-50">
      <div className="px-8 mb-12 group cursor-default">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-dim to-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-on-primary text-xl">psychology</span>
          </div>
          <h1 className="text-sm font-black font-headline text-on-surface uppercase tracking-tighter">ResearchHub <span className="text-primary">AI</span></h1>
        </div>
        <p className="text-[9px] text-on-surface-variant font-label font-bold uppercase tracking-[0.3em] opacity-40">Neural Operating System</p>
      </div>

      <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <Link to="/" className={getLinkClass('/')}>
          <span className="material-symbols-outlined text-lg">home</span>
          System Home
        </Link>
        
        <div className="pt-4 pb-2">
          <p className="px-4 text-[9px] font-label font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-30 mb-2">Core Nodes</p>
        </div>

        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <span className="material-symbols-outlined text-lg">grid_view</span>
          Archive
        </Link>
        <Link to="/search" className={getLinkClass('/search')}>
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          Synthesis
        </Link>
        <Link to="/workspace" className={getLinkClass('/workspace')}>
          <span className="material-symbols-outlined text-lg">database</span>
          Repositories
        </Link>
        <Link to="/chat" className={getLinkClass('/chat')}>
          <span className="material-symbols-outlined text-lg">forum</span>
          AI Bridge
        </Link>
      </div>

      <div className="px-4 mt-auto pt-6 space-y-4 border-t border-outline-variant/5">
        <button 
          onClick={onLogout}
          className="w-full py-4 rounded-2xl bg-surface-container-highest border border-outline-variant/20 hover:bg-error/10 hover:text-error hover:border-error/40 text-on-surface-variant font-black font-headline text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">logout</span>
          Terminate Session
        </button>
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-highest/30 rounded-xl border border-outline-variant/10">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(83,221,252,0.8)]"></div>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Uplink: Nominal</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
