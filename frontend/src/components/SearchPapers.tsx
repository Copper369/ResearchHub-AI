import React, { useState, useEffect } from 'react';
import { papers, workspaces } from '../api';

interface Paper {
  title: string;
  authors: string;
  abstract: string;
  date: string;
  url: string;
}

interface Workspace {
  id: number;
  name: string;
}

interface SearchPapersProps {
  workspaceId: number | null;
}

const SearchPapers: React.FC<SearchPapersProps> = ({ workspaceId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const [selectedWorkspaceForImport, setSelectedWorkspaceForImport] = useState<number | null>(null);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [paperToImport, setPaperToImport] = useState<Paper | null>(null);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaces.getAll();
      setWorkspaceList(response.data);
    } catch (err) {
      console.error('Failed to load workspaces', err);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      console.log('Searching for:', query);
      const response = await papers.search(query);
      console.log('Search response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
        if (response.data.length === 0) {
          setError('No papers found. Try different keywords.');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Search failed', err);
      setError(err.response?.data?.detail || 'Search failed. Please try again.');
    }
    setLoading(false);
  };

  const handleImportClick = (paper: Paper) => {
    if (workspaceList.length === 0) {
      alert('Please create a workspace first!');
      return;
    }
    if (workspaceList.length === 1) {
      // Only one workspace, import directly
      handleImport(paper, workspaceList[0].id);
    } else {
      // Multiple workspaces, show selector
      setPaperToImport(paper);
      setSelectedWorkspaceForImport(workspaceId || workspaceList[0].id);
      setShowWorkspaceModal(true);
    }
  };

  const handleImport = async (paper: Paper, targetWorkspaceId: number) => {
    try {
      await papers.import(paper, targetWorkspaceId);
      alert('Paper imported successfully!');
      setShowWorkspaceModal(false);
      setPaperToImport(null);
    } catch (err) {
      console.error('Import failed', err);
      alert('Failed to import paper. Please try again.');
    }
  };

  const confirmImport = () => {
    if (paperToImport && selectedWorkspaceForImport) {
      handleImport(paperToImport, selectedWorkspaceForImport);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h2 className="text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface uppercase">Knowledge Synthesis</h2>
        <div className="flex gap-4">
          <div className="h-1 w-24 bg-secondary rounded-full shadow-[0_0_12px_rgba(83,221,252,0.5)]"></div>
          <div className="h-1 w-12 bg-surface-container-highest rounded-full"></div>
        </div>
        <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mt-6 opacity-70">Query the Global Neural Archive</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-secondary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            type="text"
            placeholder="Search papers... (e.g., 'machine learning', 'neural networks')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all font-body"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary font-black font-headline tracking-tighter px-10 py-4 rounded-2xl shadow-xl shadow-primary-dim/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          disabled={loading || !query}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
              <span>SYNTHESIZING...</span>
            </div>
          ) : 'EXECUTE SEARCH'}
        </button>
      </div>
      
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error px-6 py-4 rounded-2xl mb-8 flex items-center gap-4">
          <span className="material-symbols-outlined">error</span>
          <span className="font-label text-xs uppercase tracking-widest">{error}</span>
        </div>
      )}
      
      {loading && results.length === 0 && (
        <div className="text-center py-20 bg-surface-container-low/20 rounded-3xl border border-outline-variant/10">
          <div className="inline-block animate-pulse mb-4">
             <div className="w-16 h-1 w-16 bg-secondary/30 rounded-full mb-1"></div>
             <div className="w-16 h-1 w-16 bg-primary/30 rounded-full mb-1 ml-4"></div>
             <div className="w-16 h-1 w-16 bg-tertiary/30 rounded-full ml-8"></div>
          </div>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest mt-4">Syncing with arXiv neural nodes...</p>
        </div>
      )}
      
      {!loading && results.length === 0 && !error && query && (
        <div className="text-center py-20 bg-surface-container-low/20 rounded-3xl border border-outline-variant/10">
          <span className="material-symbols-outlined text-5xl mb-4 opacity-20">inventory_2</span>
          <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest">No matching datasets found in current subspace.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {results.map((paper, idx) => (
          <div key={idx} className="group bg-surface-container-high/40 border border-outline-variant/10 p-8 rounded-3xl hover:bg-surface-bright hover:border-secondary/30 transition-all duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[9px] font-bold font-label uppercase tracking-widest rounded-sm border border-secondary/20">Knowledge Node</span>
                <span className="text-[9px] font-label text-on-surface-variant uppercase tracking-widest">{paper.date}</span>
              </div>
              
              <h3 className="text-2xl font-black font-headline leading-tight tracking-tighter text-on-surface mb-4 group-hover:text-primary transition-colors">{paper.title}</h3>
              
              <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                {paper.abstract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">person</span>
                   </div>
                   <div>
                      <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Lead Research</p>
                      <p className="text-xs font-bold text-on-surface truncate max-w-[200px]">{paper.authors.split(',')[0]} et al.</p>
                   </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-surface-container-highest border border-outline-variant/20 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors"
                    title="View Source"
                  >
                    <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                  <button
                    onClick={() => handleImportClick(paper)}
                    className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary px-6 py-3 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-all"
                  >
                    Import to Core
                  </button>
                </div>
              </div>
            </div>
            
            {/* Subtle background glow on hover */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="mt-12 text-center">
          <p className="inline-block px-4 py-1.5 bg-surface-container-highest/50 border border-outline-variant/20 rounded-full text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em]">
            Neural Indexing: {results.length} results recovered
          </p>
        </div>
      )}

      {/* Workspace Selection Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-surface-container border border-outline-variant/20 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
            <div className="intelligence-pulse"></div>
            
            <div className="p-8">
              <h3 className="text-2xl font-black font-headline tracking-tighter text-on-surface mb-2">Target Destination</h3>
              <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest opacity-70 mb-8">Select core workspace for synthesis</p>
              
              <div className="space-y-3 mb-10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {workspaceList.map((ws) => (
                  <label key={ws.id} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${selectedWorkspaceForImport === ws.id ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_20px_rgba(83,221,252,0.1)]' : 'border-outline-variant/10 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
                    <input
                      type="radio"
                      name="workspace"
                      value={ws.id}
                      checked={selectedWorkspaceForImport === ws.id}
                      onChange={() => setSelectedWorkspaceForImport(ws.id)}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined mr-3 text-xl">{selectedWorkspaceForImport === ws.id ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
                    <span className="font-bold font-headline tracking-tight">{ws.name}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowWorkspaceModal(false);
                    setPaperToImport(null);
                  }}
                  className="flex-1 bg-surface-container-highest border border-outline-variant/20 rounded-xl py-3 font-label text-xs uppercase tracking-widest font-bold text-on-surface transition-colors"
                >
                  ABORT
                </button>
                <button
                  onClick={confirmImport}
                  className="flex-1 bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary-fixed font-black font-headline tracking-tighter py-3 rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  INITIALIZE IMPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPapers;
