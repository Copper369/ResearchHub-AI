import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NeuralParticles from './NeuralParticles';
import HeroCharacter from './HeroCharacter';

interface HomeProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const slides = [
  {
    title: "Intelligent Paper Management",
    subtitle: "Discover, organize, and analyze academic research with AI-powered insights",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&h=600&fit=crop&q=80"
  },
  {
    title: "AI-Powered Research Assistant",
    subtitle: "Get instant answers and insights from your research papers using advanced AI",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=80"
  },
  {
    title: "Organize Research Efficiently",
    subtitle: "Create workspaces, import papers, and keep your research perfectly organized",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&q=80"
  }
];

const Home: React.FC<HomeProps> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [titleProgress, setTitleProgress] = useState(0);
  const [subtitleProgress, setSubtitleProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTitleProgress(0);
    setSubtitleProgress(0);
    
    const title = slides[currentSlide].title;
    const subtitle = slides[currentSlide].subtitle;
    
    let tProgress = 0;
    const titleTimer = setInterval(() => {
      if (tProgress <= title.length) {
        setTitleProgress(tProgress);
        tProgress++;
      } else {
        clearInterval(titleTimer);
        let sProgress = 0;
        const subtitleTimer = setInterval(() => {
          if (sProgress <= subtitle.length) {
            setSubtitleProgress(sProgress);
            sProgress++;
          } else {
            clearInterval(subtitleTimer);
          }
        }, 20);
      }
    }, 40);

    return () => clearInterval(titleTimer);
  }, [currentSlide]);

  const renderTitle = () => {
    const title = slides[currentSlide].title;
    const words = title.split(' ');
    let charCount = 0;

    return words.map((word, i) => {
      const start = charCount;
      charCount += word.length + 1; // +1 for space

      const visibleChars = Math.max(0, Math.min(word.length, titleProgress - start));
      const wordText = word.substring(0, visibleChars);
      
      if (visibleChars === 0) return null;

      return (
        <span key={i} className={i % 2 === 1 ? 'text-primary mr-3' : 'text-on-surface mr-3'}>
          {wordText}
        </span>
      );
    });
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleFeatureClick = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="dark min-h-screen bg-surface font-body overflow-x-hidden">
      <div className="noise-bg fixed inset-0 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-dim to-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-primary">psychology</span>
              </div>
              <div>
                <h1 className="text-xl font-black font-headline tracking-tighter text-on-surface uppercase leading-none">ResearchHub <span className="text-primary">AI</span></h1>
                <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Neural Synthesis</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-10">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all">Archive</Link>
                  <Link to="/search" className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all">Synthesis</Link>
                  <Link to="/workspace" className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all">Nodes</Link>
                  <button 
                    onClick={onLogout}
                    className="px-6 py-2 bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-xl font-label text-[10px] font-bold uppercase tracking-widest hover:bg-surface-bright transition-all"
                  >
                    DISCONNECT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all">Authorization</Link>
                  <Link 
                    to="/login"
                    className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-xl font-black font-headline tracking-tighter uppercase shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all"
                  >
                    INITIALIZE ACCESS
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          <NeuralParticles />
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ${
                index === currentSlide ? 'opacity-30 scale-110' : 'opacity-0 scale-100'
              } transition-transform duration-[10000ms] ease-linear`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover grayscale opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/80 to-surface"></div>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <header className="mb-8">
               <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-label font-bold text-primary uppercase tracking-[0.3em] mb-6">Next-Gen Cognitive Architecture</span>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline leading-[1.1] tracking-tighter text-on-surface mb-4 uppercase min-h-[4em] md:min-h-[3.5em] flex flex-wrap items-start content-start">
                 {renderTitle()}
                 <span className="w-1 h-[0.8em] bg-primary inline-block animate-pulse ml-2 self-center"></span>
               </h1>
               <p className="text-base md:text-lg font-body text-on-surface-variant max-w-xl leading-relaxed mb-8 min-h-[3em] md:min-h-[2.5em]">
                 {slides[currentSlide].subtitle.substring(0, subtitleProgress)}
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Link
                   to={isAuthenticated ? "/dashboard" : "/login"}
                   className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-2xl font-black font-headline tracking-tighter text-base uppercase shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.98] transition-all text-center"
                 >
                   {isAuthenticated ? "Enter Workspace" : "Begin Synthesis"}
                 </Link>
                 <button className="px-8 py-4 bg-surface-container-highest border border-outline-variant/30 text-on-surface rounded-2xl font-black font-headline tracking-tighter text-base uppercase hover:bg-surface-bright transition-all">
                   System Specs
                 </button>
               </div>
            </header>

            <div className="hidden lg:block">
              <HeroCharacter />
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1 transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'bg-primary h-12 shadow-[0_0_12px_rgba(167,165,255,0.8)]'
                  : 'bg-outline-variant h-4 hover:bg-on-surface-variant'
              }`}
            />
          ))}
        </div>

        {/* Floating Intelligence Element */}
        <div className="absolute bottom-12 left-6 text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-[0.4em] flex items-center gap-4">
           <div className="w-12 h-[1px] bg-outline-variant"></div>
           Neural Processing Layer v4.0.2 Active
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-surface-container-low/20">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
             <h2 className="text-[10px] font-label font-bold text-secondary uppercase tracking-[0.5em] mb-4">Core Cognitive Capabilities</h2>
             <p className="text-5xl font-black font-headline text-on-surface tracking-tighter uppercase">Infinite Potential Retrieval</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Search */}
            <button
              onClick={() => handleFeatureClick('/search')}
              className="group bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-10 hover:bg-surface-bright hover:border-primary/40 transition-all duration-500 text-left relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">travel_explore</span>
              </div>
              <h3 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tighter mb-4">Neural Discovery</h3>
              <p className="text-on-surface-variant font-body leading-relaxed mb-8 opacity-70">
                Traverse millions of datasets with hyper-intelligent neural filtering and precision vector matching.
              </p>
              <div className="flex items-center gap-2 text-primary font-label text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                ENGAGE SCANNER <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            </button>

            {/* Feature 2 - Organize */}
            <button
              onClick={() => handleFeatureClick('/workspace')}
              className="group bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-10 hover:bg-surface-bright hover:border-tertiary/40 transition-all duration-500 text-left relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-tertiary group-hover:text-on-tertiary transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">hub</span>
              </div>
              <h3 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tighter mb-4">Node Clusters</h3>
              <p className="text-on-surface-variant font-body leading-relaxed mb-8 opacity-70">
                Architect knowledge repositories for multithreaded research projects with seamless data persistence.
              </p>
              <div className="flex items-center gap-2 text-tertiary font-label text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                OPEN REPOSITORIES <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tertiary/5 rounded-full blur-3xl group-hover:bg-tertiary/10 transition-colors"></div>
            </button>

            {/* Feature 3 - AI Insights */}
            <button
              onClick={() => handleFeatureClick('/chat')}
              className="group bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-10 hover:bg-surface-bright hover:border-secondary/40 transition-all duration-500 text-left relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">psychology</span>
              </div>
              <h3 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tighter mb-4">AI Linkage</h3>
              <p className="text-on-surface-variant font-body leading-relaxed mb-8 opacity-70">
                Bridge your cognition with advanced AI to extract summaries, correlations, and cross-domain insights.
              </p>
              <div className="flex items-center gap-2 text-secondary font-label text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                BRIDGE CONNECTION <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors"></div>
            </button>

            {/* Feature 4 - Processing */}
            <button
              onClick={() => handleFeatureClick('/dashboard')}
              className="group bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-10 hover:bg-surface-bright hover:border-primary-dim/40 transition-all duration-500 text-left relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-primary-dim/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary-dim group-hover:text-on-primary transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">bolt</span>
              </div>
              <h3 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tighter mb-4">Hyper Processing</h3>
              <p className="text-on-surface-variant font-body leading-relaxed mb-8 opacity-70">
                Accelerated by Llama 3.3 70B across distributed neural nodes for zero-latency intelligence.
              </p>
              <div className="flex items-center gap-2 text-primary-dim font-label text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                VIEW LATENCY <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-dim/5 rounded-full blur-3xl group-hover:bg-primary-dim/10 transition-colors"></div>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-dim/20 to-secondary/20 backdrop-blur-3xl"></div>
        <div className="intelligence-pulse"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-on-surface mb-6 uppercase">
            Transform Your <span className="text-primary">Cognition</span>
          </h2>
          <p className="text-xl md:text-2xl font-body text-on-surface-variant max-w-3xl mx-auto mb-12 opacity-80 leading-relaxed">
            Join the global neural network of elite researchers utilizing state-of-the-art AI to accelerate the future of science.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="px-12 py-5 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-2xl font-black font-headline tracking-tighter text-xl uppercase shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.98] transition-all"
            >
              {isAuthenticated ? "Enter Dashboard" : "Get Started Now"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Interface */}
      <footer className="py-12 border-t border-outline-variant/10 bg-surface">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-50">
               <span className="material-symbols-outlined text-primary">psychology</span>
               <span className="font-label text-[10px] font-bold uppercase tracking-[0.4em]">ResearchHub AI // Neural Operating System</span>
            </div>
            <div className="flex items-center gap-10">
               <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">System Status: <span className="text-secondary">Nominal</span></span>
               <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">© 2026 NS-TECH</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
