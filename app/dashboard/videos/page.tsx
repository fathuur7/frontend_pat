"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface VideoSeries {
  id: string;
  title: string;
  description?: string;
  genres?: { id: string; name: string }[];
  thumbnailUrl?: string;
  status: "DRAFT" | "ONGOING" | "COMPLETED";
  views: number;
  likes: number;
  createdAt: string;
  _count: { episodes: number };
}

const STATUS_CFG = {
  DRAFT:     { label: "Draft",     color: "bg-slate-100 text-slate-500",  icon: "draft" },
  ONGOING:   { label: "Ongoing",   color: "bg-blue-100 text-blue-600",    icon: "play_circle" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-600",  icon: "check_circle" },
};

export default function VideosPage() {
  const [series, setSeries] = useState<VideoSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeries = useCallback(async () => {
    const token = localStorage.getItem("nadasaku_token");
    if (!token) return;
    try {
      setIsLoading(true);
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

  return (
    <div className="p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black font-bubbly text-slate-900">My Series</h1>
          <p className="text-slate-500 font-bold uppercase text-sm mt-1">
            All video series you have created
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSeries}
            className="flex items-center gap-2 px-4 py-2 comic-border-thin rounded-xl font-black text-sm uppercase text-slate-600 hover:bg-white transition-all">
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
          <Link href="/dashboard/upload"
            className="flex items-center gap-2 px-4 py-2 bg-comic-primary comic-border-thin rounded-xl font-black text-sm uppercase hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <span className="material-symbols-outlined text-base">add</span>
            New Series
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400 font-bold">
          <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
          Loading your series...
        </div>
      ) : series.length === 0 ? (
        <div className="bg-white comic-border rounded-2xl p-16 text-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <span className="material-symbols-outlined text-7xl text-slate-200">video_library</span>
          <p className="font-black text-xl text-slate-400 uppercase mt-4">No series yet</p>
          <p className="text-slate-400 font-bold mt-2">Create your first series to get started!</p>
          <Link href="/dashboard/upload"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-comic-primary comic-border-thin rounded-xl font-black uppercase hover:-translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <span className="material-symbols-outlined">add_circle</span>
            Create Series
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {series.map((video) => {
            const cfg = STATUS_CFG[video.status] ?? STATUS_CFG.DRAFT;
            return (
              <div key={video.id}
                className="bg-white comic-border rounded-2xl p-5 flex items-center gap-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all">

                {/* Thumbnail */}
                <div className="w-32 h-20 rounded-xl overflow-hidden comic-border-thin shrink-0 bg-slate-900 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl.startsWith("http") ? video.thumbnailUrl : `${BACKEND_URL}${video.thumbnailUrl}`} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-slate-500">movie</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-lg truncate">{video.title}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {video.genres && video.genres.map(g => (
                      <span key={g.id} className="inline-block text-xs font-black uppercase bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  {video.description && (
                    <p className="text-sm text-slate-400 font-medium truncate mt-1">{video.description}</p>
                  )}
                  <p className="text-xs text-slate-300 font-bold mt-1.5">
                    Created {new Date(video.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden lg:flex items-center gap-6 text-center shrink-0">
                  <div>
                    <p className="font-black text-slate-900 text-lg">{video._count?.episodes ?? 0}</p>
                    <p className="text-xs font-black text-slate-400 uppercase">Episodes</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg">{(video.views ?? 0).toLocaleString()}</p>
                    <p className="text-xs font-black text-slate-400 uppercase">Views</p>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg">{(video.likes ?? 0).toLocaleString()}</p>
                    <p className="text-xs font-black text-slate-400 uppercase">Likes</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase ${cfg.color}`}>
                    <span className="material-symbols-outlined text-sm">{cfg.icon}</span>
                    {cfg.label}
                  </span>
                  <Link href={`/dashboard/upload`}
                    className="text-xs font-black text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Episode
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
