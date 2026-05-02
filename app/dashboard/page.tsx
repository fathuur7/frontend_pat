"use client";

import { useState, useEffect, useCallback } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface VideoSeries {
  id: string;
  title: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  _count: { episodes: number };
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-white comic-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black text-slate-900">{value.toLocaleString()}</p>
      <p className="text-sm font-bold text-slate-500 uppercase mt-1">{label}</p>
    </div>
  );
}

export default function DashboardOverview() {
  const [series, setSeries] = useState<VideoSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalViews = series.reduce((s, v) => s + (v.views ?? 0), 0);
  const totalLikes = series.reduce((s, v) => s + (v.likes ?? 0), 0);
  const totalComments = series.reduce((s, v) => s + (v.comments ?? 0), 0);
  const totalEpisodes = series.reduce((s, v) => s + (v._count?.episodes ?? 0), 0);

  const fetchSeries = useCallback(async () => {
    const token = localStorage.getItem("nadasaku_token");
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/my-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSeries(data.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSeries(); }, [fetchSeries]);

  const STATUS_COLOR: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-500",
    ONGOING: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-green-100 text-green-600",
  };

  return (
    <div className="p-10 space-y-10">
      <div>
        <h1 className="text-4xl font-black font-bubbly text-slate-900">Analytics Overview</h1>
        <p className="text-slate-500 font-bold uppercase text-sm mt-1">
          Performance summary across all your series
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="visibility"   label="Total Views"    value={totalViews}    color="bg-blue-100 text-blue-600" />
        <StatCard icon="thumb_up"     label="Total Likes"    value={totalLikes}    color="bg-comic-primary text-slate-900" />
        <StatCard icon="chat_bubble"  label="Comments"       value={totalComments} color="bg-purple-100 text-purple-600" />
        <StatCard icon="play_circle"  label="Total Episodes" value={totalEpisodes} color="bg-green-100 text-green-600" />
      </div>

      {/* Series Table */}
      <div className="bg-white comic-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-comic-primary">leaderboard</span>
          Series Performance
        </h2>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-400 font-bold py-10 justify-center">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Loading analytics...
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-5xl text-slate-300">bar_chart</span>
            <p className="font-black text-slate-400 uppercase mt-3">No series yet</p>
            <p className="text-sm text-slate-400 font-bold mt-1">Create your first series to start tracking!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left">
                  <th className="pb-3 font-black text-slate-500 uppercase text-xs">Series</th>
                  <th className="pb-3 font-black text-slate-500 uppercase text-xs text-right">Episodes</th>
                  <th className="pb-3 font-black text-slate-500 uppercase text-xs text-right">Views</th>
                  <th className="pb-3 font-black text-slate-500 uppercase text-xs text-right">Likes</th>
                  <th className="pb-3 font-black text-slate-500 uppercase text-xs text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {series.map((v) => (
                  <tr key={v.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-black text-slate-900 truncate max-w-xs">{v.title}</p>
                      <p className="text-xs text-slate-400 font-bold">
                        {new Date(v.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>
                    <td className="py-3 font-black text-slate-700 text-right">
                      {v._count?.episodes ?? 0}
                    </td>
                    <td className="py-3 font-black text-slate-700 text-right">
                      {(v.views ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 font-black text-slate-700 text-right">
                      {(v.likes ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black uppercase ${STATUS_COLOR[v.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
