import React, { useState, useEffect } from 'react';
import { workspaces, papers } from '../api';

interface WorkspaceProps {
  onSelectWorkspace: (id: number) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onSelectWorkspace }) => {
  const [workspaceList, setWorkspaceList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [workspacePapers, setWorkspacePapers] = useState<any[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadPapers(selectedId);
    }
  }, [selectedId]);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaces.getAll();
      setWorkspaceList(response.data);
    } catch (err) {
      console.error('Failed to load workspaces', err);
    }
  };

  const loadPapers = async (id: number) => {
    try {
      const response = await papers.getByWorkspace(id);
      setWorkspacePapers(response.data);
    } catch (err) {
      console.error('Failed to load papers', err);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName) return;
    try {
      await workspaces.create(newWorkspaceName);
      setNewWorkspaceName('');
      loadWorkspaces();
    } catch (err) {
      console.error('Failed to create workspace', err);
    }
  };

  const selectWorkspace = (id: number) => {
    setSelectedId(id);
    onSelectWorkspace(id);
  };

  const openPaper = (paper: any) => {
    setSelectedPaper(paper);
    setShowPaperModal(true);
  };

  const closePaperModal = () => {
    setShowPaperModal(false);
    setSelectedPaper(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedId) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      await papers.upload(file, selectedId);
      alert('PDF uploaded successfully!');
      loadPapers(selectedId);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Failed to upload PDF', err);
      alert(err.response?.data?.detail || 'Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileUpload = () => {
    if (!selectedId) {
      alert('Please select a workspace first');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h2 className="text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface uppercase">Neural Repositories</h2>
        <div className="flex gap-4">
          <div className="h-1 w-24 bg-tertiary rounded-full shadow-[0_0_12px_rgba(193,128,255,0.5)]"></div>
          <div className="h-1 w-12 bg-surface-container-highest rounded-full"></div>
        </div>
      </header>

      {/* Create Workspace Card */}
      <div className="bg-surface-container-low/40 border border-outline-variant/10 rounded-3xl p-8 mb-12 backdrop-blur-sm">
        <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-6">Initialize New Repository</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter workspace name (e.g., 'Quantum Neural Search')"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            className="flex-1 bg-surface-container-highest border border-outline-variant/30 rounded-2xl py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-all font-body"
          />
          <button
            onClick={createWorkspace}
            className="bg-gradient-to-r from-tertiary to-tertiary-dim text-on-tertiary-fixed font-black font-headline tracking-tighter px-10 py-4 rounded-2xl shadow-xl shadow-tertiary-dim/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            CREATE REPOSITORY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {workspaceList.map((ws) => (
          <div
            key={ws.id}
            onClick={() => selectWorkspace(ws.id)}
            className={`group p-8 rounded-3xl cursor-pointer transition-all transform hover:scale-[1.02] border-2 relative overflow-hidden ${
              selectedId === ws.id
                ? 'bg-gradient-to-br from-tertiary-dim to-tertiary border-tertiary shadow-xl shadow-tertiary/20'
                : 'bg-surface-container-low border-outline-variant/10 hover:border-tertiary/30 hover:bg-surface-container-high'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md ${
                  selectedId === ws.id ? 'bg-black/10' : 'bg-tertiary/10 text-tertiary'
                }`}>
                  <span className={`material-symbols-outlined text-3xl ${selectedId === ws.id ? 'text-white' : 'text-tertiary'}`}>database</span>
                </div>
                <h3 className={`text-xl font-black font-headline tracking-tighter ${selectedId === ws.id ? 'text-white' : 'text-on-surface'}`}>{ws.name}</h3>
              </div>
              <p className={`font-label text-xs uppercase tracking-widest ${selectedId === ws.id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                {selectedId === ws.id ? 'Currently Accessing' : 'Access Repository'}
              </p>
            </div>
            {selectedId === ws.id && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            )}
          </div>
        ))}
      </div>

      {selectedId && (
        <section className="bg-surface-container-low/40 border border-outline-variant/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-tertiary/30 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black font-headline tracking-tighter text-on-surface">Repository Knowledge Nodes</h3>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Found {workspacePapers.length} synced papers</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={triggerFileUpload}
                disabled={uploading}
                className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary px-6 py-3 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-primary/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined">{uploading ? 'sync' : 'upload_file'}</span>
                {uploading ? 'SYNCING...' : 'UPLOAD NEURAL PDF'}
              </button>
            </div>
          </div>

          {workspacePapers.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-high/20 rounded-3xl border border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-6xl mb-6 opacity-20">inventory_2</span>
              <p className="text-lg font-bold font-headline tracking-tighter text-on-surface">Subspace is currently empty</p>
              <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mt-2 mb-8">Import papers or upload datasets to begin</p>
              <button
                onClick={triggerFileUpload}
                className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary hover:text-on-secondary px-8 py-3 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-all"
              >
                INITIALIZE LOAD
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              {workspacePapers.map((paper) => (
                <div key={paper.id} className="relative pl-10 pb-8 group last:pb-0">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_12px_rgba(193,128,255,0.8)] group-hover:scale-125 transition-transform"></div>
                  <div className="absolute left-[3px] top-4 w-[1px] h-full bg-outline-variant/30 group-last:bg-transparent"></div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-2xl bg-surface-container-high/0 hover:bg-surface-container-high/40 border border-transparent hover:border-outline-variant/10 transition-all duration-300">
                    <div className="flex-1">
                      <h4 className="text-xl font-black font-headline leading-tight tracking-tighter text-on-surface group-hover:text-tertiary transition-colors mb-2">{paper.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{paper.date}</span>
                        <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                        <span className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold truncate max-w-[200px]">{paper.authors}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-surface-container-highest border border-outline-variant/20 rounded-xl flex items-center justify-center text-on-surface hover:text-tertiary transition-colors"
                        title="View Source"
                      >
                        <span className="material-symbols-outlined">open_in_new</span>
                      </a>
                      <button
                        onClick={() => openPaper(paper)}
                        className="bg-tertiary/10 text-tertiary border border-tertiary/20 hover:bg-tertiary hover:text-on-tertiary px-6 py-3 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-all"
                      >
                        SYNTHESIZE DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* PAPER DETAIL SLIDE-IN PANEL */}
      {showPaperModal && selectedPaper && (
        <aside className="fixed right-0 top-0 h-screen w-full md:w-[640px] glass-panel border-l border-outline-variant/20 shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
          <div className="intelligence-pulse"></div>
          
          <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/40">
            <div className="flex items-center gap-3">
              <button 
                onClick={closePaperModal}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Neural Analysis // {selectedPaper.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">bookmark</span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-20">
            <header className="py-12 border-b border-outline-variant/10">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold font-label uppercase tracking-tighter rounded border border-secondary/20">Knowledge Node</span>
                <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold font-label uppercase tracking-tighter rounded border border-tertiary/20">Synthesized</span>
              </div>
              <h1 className="text-4xl font-black font-headline leading-[1.1] tracking-tighter text-on-surface mb-6">
                {selectedPaper.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface truncate max-w-[300px]">{selectedPaper.authors}</p>
                  <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest leading-none mt-1">{selectedPaper.date}</p>
                </div>
              </div>
            </header>

            <section className="py-12">
              <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary-dim font-bold mb-8">Executive Extraction</h3>
              <p className="text-on-surface-variant font-body leading-relaxed text-lg">
                {selectedPaper.abstract}
              </p>
            </section>

            <section className="py-12 bg-surface-container-low/20 rounded-2xl p-8 border border-outline-variant/10 mb-8">
              <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-6">Neural Origin</h3>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-surface-container-highest text-on-surface group truncate flex-1">
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Source URL</p>
                  <a href={selectedPaper.url} target="_blank" rel="noopener noreferrer" className="text-secondary font-medium hover:underline text-sm truncate block">
                    {selectedPaper.url}
                  </a>
                </div>
              </div>
            </section>
          </div>

          <div className="p-6 bg-surface-container-low/80 backdrop-blur-md border-t border-outline-variant/10">
            <div className="flex gap-4">
              <a
                href={selectedPaper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dim text-on-primary font-black font-headline tracking-tighter text-center shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                OPEN SYNERGY SOURCE
              </a>
              <button className="w-14 h-14 rounded-xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-bright transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Workspace;
