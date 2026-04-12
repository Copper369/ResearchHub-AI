import React, { useState, useEffect } from 'react';
import { workspaces, papers, chat } from '../api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    workspaces: 0,
    papers: 0,
    chats: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const workspacesRes = await workspaces.getAll();
      const workspaceList = workspacesRes.data;
      
      let totalPapers = 0;
      let totalChats = 0;
      const activities: any[] = [];

      for (const ws of workspaceList) {
        const papersRes = await papers.getByWorkspace(ws.id);
        const chatsRes = await chat.getHistory(ws.id);
        
        totalPapers += papersRes.data.length;
        totalChats += chatsRes.data.length;

        // Add recent activities
        papersRes.data.slice(0, 3).forEach((paper: any) => {
          activities.push({
            type: 'paper',
            workspace: ws.name,
            title: paper.title,
            date: paper.date
          });
        });
      }

      setStats({
        workspaces: workspaceList.length,
        papers: totalPapers,
        chats: totalChats
      });

      setRecentActivity(activities.slice(0, 5));
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h2 className="text-5xl font-black font-headline tracking-tighter mb-4 text-on-surface">Intelligence Dashboard</h2>
        <div className="flex gap-4">
          <div className="h-1 w-24 bg-primary-dim rounded-full shadow-[0_0_12px_rgba(100,94,251,0.5)]"></div>
          <div className="h-1 w-12 bg-surface-container-highest rounded-full"></div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-primary-dim to-primary rounded-2xl p-6 text-on-primary-fixed shadow-xl shadow-primary-dim/10 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest opacity-80">Workspaces</p>
              <p className="text-5xl font-black font-headline tracking-tighter mt-2">{stats.workspaces}</p>
            </div>
            <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">database</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-lg group hover:border-secondary/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Papers Archive</p>
              <p className="text-5xl font-black font-headline tracking-tighter text-on-surface mt-2 group-hover:text-secondary transition-colors">{stats.papers}</p>
            </div>
            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-lg group hover:border-tertiary/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">AI Synthesis</p>
              <p className="text-5xl font-black font-headline tracking-tighter text-on-surface mt-2 group-hover:text-tertiary transition-colors">{stats.chats}</p>
            </div>
            <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">forum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="bg-surface-container-low/40 border border-outline-variant/10 rounded-3xl p-8 backdrop-blur-sm">
        <h3 className="font-label text-xs uppercase tracking-[0.2em] text-primary-dim font-bold mb-10">Neural Activity Stream</h3>
        
        {recentActivity.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant bg-surface-container-high/20 rounded-2xl border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-5xl mb-4 opacity-20">history</span>
            <p className="text-lg font-bold font-headline tracking-tight">No activity logs found</p>
            <p className="text-sm font-label uppercase tracking-widest mt-2">Initialize your first research session</p>
          </div>
        ) : (
          <div className="space-y-0">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="relative pl-10 pb-8 group last:pb-0">
                {/* Visual Timeline Path */}
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(83,221,252,0.8)] group-hover:scale-125 transition-transform"></div>
                <div className="absolute left-[3px] top-4 w-[1px] h-full bg-outline-variant/30 group-last:bg-transparent"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-high/0 hover:bg-surface-container-high/40 border border-transparent hover:border-outline-variant/10 transition-all duration-300">
                  <div>
                    <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">{activity.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold">{activity.workspace}</span>
                      <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant leading-none">{activity.type === 'paper' ? 'Knowledge Import' : 'Synthesis'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">{activity.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
