"use client";

import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function VideoGrid() {
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/videos?sort=likes&limit=50&excludeGenre=MOVIE`);
        const data = await res.json();
        if (data.success) {
          setSeriesList(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch series", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSeries();
  }, []);

  return (
    <section className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
          <span className="material-symbols-outlined text-comic-blue text-4xl font-black">
            favorite
          </span>
          MOST LIKED SERIES
        </h3>
        <button className="font-black text-sm uppercase underline decoration-4 decoration-comic-primary hover:text-comic-blue transition-colors">
          Surprise Me!
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 font-bold">
          <span className="material-symbols-outlined animate-spin text-3xl mr-2">refresh</span>
          Loading latest series...
        </div>
      ) : seriesList.length === 0 ? (
        <div className="text-center py-20 comic-border-thin bg-slate-50 rounded-2xl">
          <span className="material-symbols-outlined text-6xl text-slate-300">movie</span>
          <p className="font-black text-slate-400 uppercase mt-2">No Series Found</p>
          <p className="text-sm font-bold text-slate-400">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {seriesList.map((series) => (
            <VideoCard key={series.id} series={series} />
          ))}
        </div>
      )}
    </section>
  );
}

