import React, { useState, useEffect, useCallback } from 'react';
import { chat, workspaces } from '../api';

interface Workspace {
  id: number;
  name: string;
}

interface ChatbotProps {
  workspaceId: number | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ workspaceId: initialWorkspaceId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(initialWorkspaceId);

  const loadWorkspaces = useCallback(async () => {
    try {
      const response = await workspaces.getAll();
      setWorkspaceList(response.data);
      if (response.data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load workspaces', err);
    }
  }, [selectedWorkspace]);

  const loadHistory = useCallback(async () => {
    if (!selectedWorkspace) return;
    try {
      const response = await chat.getHistory(selectedWorkspace);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    if (selectedWorkspace) {
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [selectedWorkspace, loadHistory]);

  const clearChat = async () => {
    if (!selectedWorkspace) return;
    
    const confirmed = window.confirm('Are you sure you want to clear all chat history for this workspace? This cannot be undone.');
    if (!confirmed) return;
    
    try {
      await chat.clearHistory(selectedWorkspace);
      setMessages([]);
      alert('Chat history cleared successfully!');
    } catch (err) {
      console.error('Failed to clear chat history', err);
      alert('Failed to clear chat history. Please try again.');
    }
  };

  const formatResponse = (text: string) => {
    // Remove or convert markdown formatting
    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold + Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br/>'); // Line breaks
  };

  const sendMessage = async () => {
    if (!input || !selectedWorkspace) return;
    setLoading(true);
    try {
      const response = await chat.send(selectedWorkspace, input);
      setMessages([...messages, { message: input, response: response.data.response }]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message. Make sure you have papers in this workspace.');
    }
    setLoading(false);
  };

  if (workspaceList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-surface-container-low/40 border border-outline-variant/10 rounded-3xl p-12 backdrop-blur-sm relative overflow-hidden">
          <div className="intelligence-pulse"></div>
          <span className="material-symbols-outlined text-6xl mb-6 text-primary opacity-50">data_alert</span>
          <h3 className="text-3xl font-black font-headline tracking-tighter text-on-surface mb-4">Neural Link Severed</h3>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest opacity-70 mb-8">No active repositories detected. Synthesis requires a knowledge base.</p>
          <p className="text-sm font-body text-on-surface-variant mb-0">Navigate to Workspaces and initialize a repository to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface uppercase leading-none">AI Synthesis</h2>
            <div className="flex gap-4">
              <div className="h-1 w-24 bg-primary rounded-full shadow-[0_0_12px_rgba(167,165,255,0.5)]"></div>
              <div className="h-1 w-12 bg-surface-container-highest rounded-full"></div>
            </div>
          </div>
          {selectedWorkspace && messages.length > 0 && (
            <button
              onClick={clearChat}
              className="bg-error/10 text-error border border-error/20 hover:bg-error hover:text-on-error px-4 py-2 rounded-xl font-label text-[10px] uppercase tracking-widest font-bold transition-all"
            >
              PURGE HISTORY
            </button>
          )}
        </div>
        
        {/* Workspace Selector */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-surface-container-low/40 border border-outline-variant/10 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">database</span>
            <label className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">Active Repository:</label>
          </div>
          <select
            value={selectedWorkspace || ''}
            onChange={(e) => setSelectedWorkspace(Number(e.target.value))}
            className="flex-1 bg-surface-container-highest border border-outline-variant/30 rounded-xl py-2 px-4 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body cursor-pointer"
          >
            {workspaceList.map((ws) => (
              <option key={ws.id} value={ws.id} className="bg-surface-container-highest">
                {ws.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 bg-surface-container-low/20 border border-outline-variant/10 p-8 rounded-3xl backdrop-blur-sm custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
            <span className="material-symbols-outlined text-7xl mb-6">bubble_chart</span>
            <p className="text-xl font-black font-headline tracking-tighter text-on-surface mb-2">Neural Connection Established</p>
            <p className="text-sm font-label uppercase tracking-widest max-w-xs">Awaiting cognitive input query based on repository datasets.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-4">
              {/* User Message */}
              <div className="flex flex-col items-end">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-lg shadow-primary/5">
                  <p className="font-label text-[9px] uppercase tracking-[0.2em] text-primary font-bold mb-2">Neural Request</p>
                  <p className="text-on-surface text-sm sm:text-base leading-relaxed">{msg.message}</p>
                </div>
              </div>
              
              {/* AI Message */}
              <div className="flex flex-col items-start">
                <div className="bg-surface-container-high border border-outline-variant/20 rounded-2xl rounded-tl-none p-6 max-w-[85%] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                  <p className="font-label text-[9px] uppercase tracking-[0.2em] text-secondary font-bold mb-3">Synthesized Insight</p>
                  <div 
                    className="text-on-surface-variant text-sm sm:text-base leading-relaxed prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatResponse(msg.response) }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex gap-4 p-2 bg-surface-container-low/40 border border-outline-variant/10 rounded-3xl focus-within:border-primary/40 transition-all shadow-xl">
        <input
          type="text"
          placeholder="Query the repository... (e.g. 'Summarize the key findings on latent space topology')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 py-4 px-6 font-body"
          disabled={loading || !selectedWorkspace}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary font-black font-headline tracking-tighter px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          disabled={loading || !input || !selectedWorkspace}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">send</span>
              <span className="hidden sm:inline">SYNTHESIZE</span>
            </div>
          )}
        </button>
      </div>
      
      {!selectedWorkspace && (
        <p className="text-[10px] font-label text-error uppercase tracking-widest text-center mt-3 animate-pulse">Select a repository to bridge the connection</p>
      )}
    </div>
  );
};

export default Chatbot;
