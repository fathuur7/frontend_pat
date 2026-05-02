"use client";

import { useState, useEffect } from "react";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface SeriesViewProps {
  series: any;
}

export default function SeriesView({ series }: SeriesViewProps) {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(
    series.episodes?.[0]?.id || null
  );
  
  const [localEpisodes, setLocalEpisodes] = useState<any[]>(series.episodes || []);
  const [seriesLikes, setSeriesLikes] = useState(series.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  
  const [isSaved, setIsSaved] = useState(series.saved || false);
  const [isSaving, setIsSaving] = useState(false);

  const [comments, setComments] = useState(series.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const selectedEpisode = series.episodes?.find((ep: any) => ep.id === selectedEpisodeId);

  useEffect(() => {
    if (selectedEpisodeId) {
      // Fire-and-forget view tracking for this episode
      fetch(`${BACKEND_URL}/api/videos/${series.id}/episodes/${selectedEpisodeId}/view`, {
        method: "POST",
      }).catch(() => {
        // Silently ignore tracking errors
      });
    }
  }, [selectedEpisodeId, series.id]);

  useEffect(() => {
    // Fetch user-specific state (saved, liked) since initial render is server-side without auth
    const token = localStorage.getItem("nadasaku_token");
    if (token) {
      fetch(`${BACKEND_URL}/api/videos/${series.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsSaved(data.data.saved);
          setLocalEpisodes(data.data.episodes || []);
        }
      })
      .catch(console.error);
    }
  }, [series.id]);

  const seriesThumbnailUrl = series.thumbnailUrl 
    ? (series.thumbnailUrl.startsWith("http") ? series.thumbnailUrl : `${BACKEND_URL}${series.thumbnailUrl}`) 
    : "";

  const mappedEpisodes = localEpisodes.map((ep: any) => ({
    id: ep.id,
    title: ep.title || `Episode ${ep.episodeNumber}`,
    src: ep.thumbnailUrl 
      ? (ep.thumbnailUrl.startsWith("http") ? ep.thumbnailUrl : `${BACKEND_URL}${ep.thumbnailUrl}`) 
      : seriesThumbnailUrl,
    hlsUrl: ep.hlsUrl ? `${BACKEND_URL}${ep.hlsUrl}` : null,
    episodeNumber: ep.episodeNumber,
    status: ep.status,
    views: ep.views,
    likes: ep.likes || 0,
    liked: ep.liked || false,
  }));

  const currentMappedEpisode = mappedEpisodes.find((ep: any) => ep.id === selectedEpisodeId);

  const handleLike = async () => {
    if (isLiking || !selectedEpisodeId) return;
    const token = localStorage.getItem("nadasaku_token");
    if (!token) {
      alert("Kamu harus login dulu untuk memberikan like!");
      return;
    }
    setIsLiking(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/${series.id}/episodes/${selectedEpisodeId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSeriesLikes(data.data.videoLikes);
        setLocalEpisodes(prev => prev.map(ep => 
          ep.id === selectedEpisodeId 
            ? { ...ep, likes: data.data.likes, liked: data.data.liked } 
            : ep
        ));
      }
    } catch (error) {
      console.error("Failed to like episode", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSaveToVault = async () => {
    const token = localStorage.getItem("nadasaku_token");
    if (!token) {
      alert("Kamu harus login dulu untuk menyimpan ke Vault!");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/vault/${series.id}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.data.saved);
      } else {
        alert(data.message || "Failed to update vault");
      }
    } catch (error) {
      console.error("Failed to save to vault", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    const token = localStorage.getItem("nadasaku_token");
    if (!token) {
      alert("Kamu harus login dulu untuk berkomentar!");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/${series.id}/comments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment("");
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const isMovie = series.genres?.some((g: any) => g.name.toUpperCase() === "MOVIE");

  return (
    <main className="flex flex-1 flex-col lg:flex-row p-4 md:p-6 gap-6 md:gap-8 max-w-[1600px] mx-auto w-full">
      {/* ── Left: player + info ── */}
      <div className={`${isMovie ? 'w-full max-w-5xl mx-auto' : 'flex-[3]'} flex flex-col gap-4 md:gap-6 min-w-0`}>
        {currentMappedEpisode ? (
          currentMappedEpisode.status === "READY" && currentMappedEpisode.hlsUrl ? (
            <VideoPlayer
              thumbnail={currentMappedEpisode.src}
              alt={currentMappedEpisode.title}
              src={currentMappedEpisode.hlsUrl}
            />
          ) : (
            <div className="bg-slate-900 rounded-xl comic-border aspect-video flex flex-col items-center justify-center text-white p-6">
              <span className="material-symbols-outlined text-6xl mb-4 text-comic-primary animate-pulse">cloud_sync</span>
              <p className="font-black text-2xl uppercase tracking-widest text-center">{currentMappedEpisode.title}</p>
              <p className="text-lg font-bold text-slate-400 mt-2 text-center">
                {currentMappedEpisode.status === "PROCESSING" ? "Video is still processing. Please check back later." : "Video stream not available."}
              </p>
            </div>
          )
        ) : (
          <div className="bg-slate-900 rounded-xl comic-border aspect-video flex flex-col items-center justify-center text-white p-6">
             <span className="material-symbols-outlined text-6xl mb-2 text-slate-500">movie</span>
             <p className="font-black text-xl text-slate-400 uppercase tracking-widest text-center">
                {isMovie ? "Movie stream not available yet" : "No episodes available yet"}
             </p>
          </div>
        )}

        <VideoInfo
          title={series.title}
          tags={series.genres ? series.genres.map((g: any) => g.name) : []}
          views={series.views || 0}
          likes={currentMappedEpisode?.likes || 0}
          liked={currentMappedEpisode?.liked || false}
          description={series.description || "No description provided."}
          onLike={handleLike}
          isLiking={isLiking}
          saved={isSaved}
          onSave={handleSaveToVault}
          isSaving={isSaving}
        />
        <div className="text-sm font-bold text-slate-500 mt-2 px-6">
          Total {isMovie ? 'Movie' : 'Series'} Likes: <span className="text-comic-primary">{seriesLikes}</span>
        </div>

        {/* ── Comments Section ── */}
        <div className="bg-white comic-border p-6 rounded-xl mt-4">
          <h3 className="font-black text-xl uppercase tracking-tighter italic mb-4 border-b-4 border-slate-900 inline-block">Comments ({comments.length})</h3>
          
          <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?" 
              className="flex-1 bg-slate-100 border-4 border-slate-900 rounded-xl px-4 py-3 font-bold outline-none focus:bg-white transition-all"
              disabled={isSubmittingComment}
            />
            <button 
              type="submit" 
              disabled={isSubmittingComment || !newComment.trim()}
              className="bg-comic-primary text-slate-900 font-black uppercase tracking-widest px-6 py-3 rounded-xl comic-border-sm hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 shrink-0"
            >
              Post
            </button>
          </form>

          <div className="flex flex-col gap-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-comic-blue uppercase">{comment.user?.name || "Unknown User"}</span>
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-bold text-slate-700 leading-relaxed">{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm font-bold text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: sidebar ── */}
      {!isMovie && (
        <div className="flex-[1] min-w-[300px]">
          <h3 className="font-black text-2xl uppercase tracking-tighter italic mb-4">Episodes</h3>
          <div className="flex flex-col gap-4">
            {mappedEpisodes.map((ep: any) => (
              <div 
                key={ep.id} 
                onClick={() => setSelectedEpisodeId(ep.id)}
                className={`flex gap-3 items-center comic-border-sm bg-white p-2 rounded-xl cursor-pointer hover:-translate-y-1 transition-all ${selectedEpisodeId === ep.id ? "ring-4 ring-comic-primary" : ""}`}
              >
                <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                  {ep.src ? (
                    <img src={ep.src} alt={ep.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">image</span></div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-slate-900 text-white text-[10px] px-1 font-black rounded-sm">Ep {ep.episodeNumber}</span>
                </div>
                <div className="flex-1">
                  <h4 className={`font-black leading-tight text-sm uppercase line-clamp-2 ${selectedEpisodeId === ep.id ? "text-comic-blue" : ""}`}>{ep.title}</h4>
                  <p className="text-xs font-bold text-slate-500 mt-1 flex gap-2 items-center">
                    <span>{ep.status === "READY" ? "▶ Play Episode" : ep.status === "PROCESSING" ? "⚙ Processing" : "⚠ Failed"}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {ep.views || 0}</span>
                  </p>
                </div>
              </div>
            ))}
            {mappedEpisodes.length === 0 && (
              <p className="text-sm font-bold text-slate-500">This series doesn't have any episodes yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
