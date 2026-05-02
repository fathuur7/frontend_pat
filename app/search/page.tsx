"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import VideoCard from "@/components/home/VideoCard";


import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/videos?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  return (
    <>
      {/* ── Query Display ── */}
      {query ? (
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black font-bubbly">
            Results for:{" "}
            <span className="text-comic-blue italic">&ldquo;{query}&rdquo;</span>
          </h2>
          <p className="font-bold text-slate-500">
            {results.length} title{results.length !== 1 ? "s" : ""} found
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black font-bubbly">
            🔍 SEARCH
          </h2>
          <p className="font-bold text-slate-500">Type something in the search bar above.</p>
        </div>
      )}

      {/* ── Results Grid ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <span className="material-symbols-outlined animate-spin text-5xl text-slate-400">refresh</span>
          <p className="font-bold text-slate-500">Searching the database...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((series) => (
            <VideoCard key={series.id} series={series} />
          ))}
        </div>
      ) : query ? (
        /* ── No Results ── */
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div
            className="w-36 h-36 bg-comic-primary flex items-center justify-center"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          >
            <span className="material-symbols-outlined text-5xl">search_off</span>
          </div>
          <h3 className="text-3xl font-black font-bubbly">NO RESULTS FOUND!</h3>
          <p className="font-bold text-slate-600 max-w-xs">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different search
            term.
          </p>
        </div>
      ) : null}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-12 flex flex-col gap-10">
        <Suspense fallback={<div className="h-10 w-64 animate-pulse bg-slate-200 rounded" />}>
          <SearchResults />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

