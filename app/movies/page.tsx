"use client";

import { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import VideoCard from "@/components/home/VideoCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function MoviesPage() {
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/videos?genre=MOVIE&limit=1000`);
        const data = await res.json();
        if (data.success) {
          setMoviesList(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col gap-8 md:gap-12 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        {/* Page Hero/Header */}
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter flex items-center gap-4">
            <span className="material-symbols-outlined text-comic-primary text-5xl font-black">
              local_movies
            </span>
            FEATURED MOVIES
          </h1>
          <p className="text-lg text-slate-700 font-bold max-w-2xl">
            Grab your popcorn! Dive into our collection of epic anime feature films.
          </p>
        </div>

        {/* Grid */}
        <section className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-32 text-slate-400 font-bold">
              <span className="material-symbols-outlined animate-spin text-4xl mr-3">refresh</span>
              Loading movies...
            </div>
          ) : moviesList.length === 0 ? (
            <div className="text-center py-32 comic-border-thin bg-slate-50 rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-slate-300">movie</span>
              <p className="font-black text-slate-400 uppercase mt-2">No Movies Found</p>
              <p className="text-sm font-bold text-slate-400">Check back later for new releases!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {moviesList.map((movie) => (
                <VideoCard key={movie.id} series={movie} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

