import React, { useState } from 'react';
import { auth } from '../api';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [institution, setInstitution] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!fullName || !email || !phone || !role || !institution) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
    }

    try {
      const response = isRegister
        ? await auth.register(username, password, fullName, email, phone, role, institution)
        : await auth.login(username, password);
      localStorage.setItem('token', response.data.access_token);
      onLogin(response.data.access_token);
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMsg = err.response?.data?.detail || 
                       err.message || 
                       'Authentication failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-surface font-body p-6 relative overflow-hidden">
      <div className="noise-bg fixed inset-0 pointer-events-none"></div>
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative bg-surface-container-low/60 backdrop-blur-2xl border border-outline-variant/20 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="intelligence-pulse absolute top-0 left-0 w-full h-[2px]"></div>
        
        <div className="text-center mb-10">
          <div className="inline-block w-20 h-20 bg-gradient-to-br from-primary-dim to-primary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl text-on-primary">psychology</span>
          </div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2 uppercase">
            ResearchHub <span className="text-primary">AI</span>
          </h1>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-[0.3em] opacity-60">
            {isRegister ? 'Initialize Neural Profile' : 'Access Intelligence Archive'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 border-b border-outline-variant/10 mb-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Neural Identity"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                  required={isRegister}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                  Email Node
                </label>
                <input
                  type="email"
                  placeholder="name@domain.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                  required={isRegister}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                  Comms Link
                </label>
                <input
                  type="tel"
                  placeholder="+X (XXX) XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                  required={isRegister}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                  Research Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body cursor-pointer"
                  required={isRegister}
                  disabled={loading}
                >
                  <option value="" className="bg-surface-container-highest">Select Access Level</option>
                  <option value="Undergraduate Student" className="bg-surface-container-highest">Undergraduate Student</option>
                  <option value="Graduate Student" className="bg-surface-container-highest">Graduate Student</option>
                  <option value="PhD Candidate" className="bg-surface-container-highest">PhD Candidate</option>
                  <option value="Postdoctoral Researcher" className="bg-surface-container-highest">Postdoctoral Researcher</option>
                  <option value="Research Assistant" className="bg-surface-container-highest">Research Assistant</option>
                  <option value="Assistant Professor" className="bg-surface-container-highest">Assistant Professor</option>
                  <option value="Associate Professor" className="bg-surface-container-highest">Associate Professor</option>
                  <option value="Professor" className="bg-surface-container-highest">Professor</option>
                  <option value="Research Scientist" className="bg-surface-container-highest">Research Scientist</option>
                  <option value="Industry Researcher" className="bg-surface-container-highest">Industry Researcher</option>
                  <option value="Independent Researcher" className="bg-surface-container-highest">Independent Researcher</option>
                  <option value="Other" className="bg-surface-container-highest">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                  Institutional Hub
                </label>
                <input
                  type="text"
                  placeholder="Organization name"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                  required={isRegister}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                Access ID
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                required
                minLength={3}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">
                Cryptography
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-error-container/20 border border-error/30 text-error px-6 py-4 rounded-2xl flex items-center gap-3 animate-shake">
              <span className="material-symbols-outlined text-xl">warning</span>
              <span className="font-label text-xs uppercase tracking-widest">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-black font-headline tracking-tighter py-5 rounded-[1.25rem] shadow-2xl shadow-primary-dim/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:grayscale uppercase"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Syncing Neural Link...</span>
              </div>
            ) : (isRegister ? 'INITIALIZE SYSTEM' : 'AUTHORIZE ACCESS')}
          </button>
        </form>

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className="w-full mt-8 text-on-surface-variant font-label text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors font-bold"
          disabled={loading}
        >
          {isRegister ? '← SWITCH TO SECURE SIGN IN' : 'INITIALIZE NEW SUBSPACE →'}
        </button>
      </div>
    </div>
  );
};

export default Login;
