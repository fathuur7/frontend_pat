"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VideoCard from "@/components/home/VideoCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function VaultView() {
  const [savedVideos, setSavedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("nadasaku_token");
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);
    fetch(`${BACKEND_URL}/api/vault`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSavedVideos(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-slate-900 border-t-comic-primary rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase text-slate-600">Loading your vault...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24">
        <div className="comic-border bg-comic-blue/10 p-6 flex gap-4 items-start max-w-xl">
          <span className="material-symbols-outlined text-comic-blue text-3xl shrink-0">lock</span>
          <div>
            <p className="font-black text-comic-blue text-xl uppercase mb-2">Sign in to access your vault</p>
            <p className="font-bold text-slate-600">
              Your watchlist and saved shows are tied to your account. Sign in or create an account
              to keep track of everything you love.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (savedVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24">
        {/* Big starburst */}
        <div className="relative">
          <div
            className="w-48 h-48 bg-comic-primary flex items-center justify-center"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          >
            <span className="material-symbols-outlined text-7xl font-bold">folder_open</span>
          </div>
        </div>

        <div className="text-center max-w-md flex flex-col gap-4">
          <h3 className="text-3xl font-black font-bubbly">YOUR VAULT IS EMPTY!</h3>
          <p className="font-bold text-slate-600">
            Looks like you haven&apos;t saved anything yet. Browse movies and series and hit
            the bookmark icon to add them here.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/movies"
            className="px-8 py-4 bg-comic-primary comic-border font-black uppercase italic hover:-translate-y-1 transition-transform"
          >
            BROWSE MOVIES
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-white comic-border font-black uppercase italic hover:-translate-y-1 transition-transform"
          >
            BROWSE SERIES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {savedVideos.map(video => (
        <VideoCard key={video.id} series={video} />
      ))}
    </div>
  );
}

