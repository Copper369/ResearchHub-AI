import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SearchPapers from './components/SearchPapers';
import Workspace from './components/Workspace';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={
              <AuthenticatedLayout onLogout={handleLogout}>
                <Dashboard />
              </AuthenticatedLayout>
            } />
            <Route path="/search" element={
              <AuthenticatedLayout onLogout={handleLogout}>
                <SearchPapers workspaceId={selectedWorkspace} />
              </AuthenticatedLayout>
            } />
            <Route path="/workspace" element={
              <AuthenticatedLayout onLogout={handleLogout}>
                <Workspace onSelectWorkspace={setSelectedWorkspace} />
              </AuthenticatedLayout>
            } />
            <Route path="/chat" element={
              <AuthenticatedLayout onLogout={handleLogout}>
                <Chatbot workspaceId={selectedWorkspace} />
              </AuthenticatedLayout>
            } />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

// Authenticated Layout Component
const AuthenticatedLayout: React.FC<{ children: React.ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  return (
    <div className="dark bg-surface text-on-surface font-body h-screen w-full flex overflow-hidden relative">
      <div className="noise-bg fixed inset-0 pointer-events-none"></div>
      
      {/* Sidebar Navigation */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content Workspace */}
      <main className="flex-1 ml-64 overflow-y-auto custom-scrollbar relative">
        {/* Intelligence Pulse line at the top of content area */}
        <div className="intelligence-pulse sticky top-0 z-20"></div>
        
        <div className="p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default App;
