"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Step = "series" | "episode";

interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

function getToken() {
  return localStorage.getItem("nadasaku_token") ?? "";
}

export default function UploadPage() {
  const [step, setStep] = useState<Step>("series");
  const [mySeries, setMySeries] = useState<Video[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");

  // Series form
  const seriesThumbnailRef = useRef<HTMLInputElement>(null);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [seriesGenre, setSeriesGenre] = useState("");
  const [seriesThumbnail, setSeriesThumbnail] = useState<File | null>(null);
  const [seriesThumbPreview, setSeriesThumbPreview] = useState<string | null>(null);

  // Episode form
  const videoFileRef = useRef<HTMLInputElement>(null);
  const epThumbnailRef = useRef<HTMLInputElement>(null);
  const [epNumber, setEpNumber] = useState("1");
  const [epTitle, setEpTitle] = useState("");
  const [epDescription, setEpDescription] = useState("");
  const [epFile, setEpFile] = useState<File | null>(null);
  const [epThumbnail, setEpThumbnail] = useState<File | null>(null);
  const [epThumbPreview, setEpThumbPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMySeries = useCallback(async () => {
    const res = await fetch(`${BACKEND_URL}/api/videos/my-videos`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) setMySeries(data.data);
  }, []);

  useEffect(() => { fetchMySeries(); }, [fetchMySeries]);

  // ── Thumbnail helpers ───────────────────────────────────────────────────────
  const handleThumb = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void,
    prevPreview: string | null
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Thumbnail must be an image."); return; }
    if (f.size > 5 * 1024 * 1024) { setError("Thumbnail must be under 5MB."); return; }
    setFile(f);
    if (prevPreview) URL.revokeObjectURL(prevPreview);
    setPreview(URL.createObjectURL(f));
  };

  // ── Step 1: Create Series ───────────────────────────────────────────────────
  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!seriesTitle) { setError("Series title is required."); return; }
    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append("title", seriesTitle);
      fd.append("description", seriesDescription);
      fd.append("genre", seriesGenre);
      if (seriesThumbnail) fd.append("thumbnail", seriesThumbnail);

      const res = await fetch(`${BACKEND_URL}/api/videos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(`Series "${data.data.title}" created! Now go to Step 2 to upload an episode.`);
      setSeriesTitle(""); setSeriesDescription(""); setSeriesGenre("");
      setSeriesThumbnail(null); setSeriesThumbPreview(null);
      fetchMySeries();
      setSelectedSeriesId(data.data.id);
      setStep("episode");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Upload Episode ──────────────────────────────────────────────────
  const handleUploadEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!selectedSeriesId) { setError("Please select a series first."); return; }
    if (!epNumber) { setError("Episode number is required."); return; }
    if (!epFile) { setError("Please select a video file."); return; }
    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append("episodeNumber", epNumber);
      if (epTitle) fd.append("title", epTitle);
      if (epDescription) fd.append("description", epDescription);
      fd.append("file", epFile);
      if (epThumbnail) fd.append("thumbnail", epThumbnail);

      const res = await fetch(`${BACKEND_URL}/api/videos/${selectedSeriesId}/episodes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(`Episode ${epNumber} uploaded! It is now being processed.`);
      setEpNumber(""); setEpTitle(""); setEpDescription("");
      setEpFile(null); setEpThumbnail(null); setEpThumbPreview(null);
      if (videoFileRef.current) videoFileRef.current.value = "";
      if (epThumbnailRef.current) epThumbnailRef.current.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black font-bubbly text-slate-900">Upload Content</h1>
          <p className="text-slate-500 font-bold uppercase text-sm mt-1">
            Create a series, then add episodes to it.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex gap-2 comic-border-thin rounded-xl p-1 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          {(["series", "episode"] as Step[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStep(s); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 rounded-lg font-black uppercase text-sm transition-all
                ${step === s
                  ? "bg-comic-primary shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "text-slate-500 hover:text-slate-900"}`}
            >
              {s === "series" ? "① Create Series" : "② Add Episode"}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 comic-border-thin bg-red-100 text-red-700 font-bold rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">error</span> {error}
          </div>
        )}
        {success && (
          <div className="p-4 comic-border-thin bg-green-100 text-green-700 font-bold rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span> {success}
          </div>
        )}

        {/* ── STEP 1: Create Series ── */}
        {step === "series" && (
          <div className="bg-white comic-border rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-comic-primary">movie</span>
              New Series
            </h2>
            <form onSubmit={handleCreateSeries} className="space-y-5">
              <div>
                <label className="block text-sm font-black uppercase mb-2">Series Title *</label>
                <input type="text" value={seriesTitle} onChange={e => setSeriesTitle(e.target.value)}
                  placeholder="e.g. Attack on Titan Season 3"
                  className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold" disabled={isLoading} />
              </div>
              <div>
                <label className="block text-sm font-black uppercase mb-2">Genres (Comma Separated)</label>
                <input type="text" value={seriesGenre} onChange={e => setSeriesGenre(e.target.value)}
                  placeholder="e.g. Action, Romance, Sci-Fi"
                  className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold" disabled={isLoading} />
              </div>
              <div>
                <label className="block text-sm font-black uppercase mb-2">Description</label>
                <textarea value={seriesDescription} onChange={e => setSeriesDescription(e.target.value)}
                  placeholder="Series overview..." rows={3}
                  className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold resize-none" disabled={isLoading} />
              </div>
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-black uppercase mb-2">Poster / Cover Image</label>
                {seriesThumbPreview ? (
                  <div className="relative rounded-xl overflow-hidden comic-border-thin aspect-video bg-slate-900">
                    <img src={seriesThumbPreview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setSeriesThumbnail(null); setSeriesThumbPreview(null); if (seriesThumbnailRef.current) seriesThumbnailRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-slate-900 text-white rounded-full p-1 hover:bg-red-600">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="image/*" ref={seriesThumbnailRef} id="series-thumb"
                      onChange={e => handleThumb(e, setSeriesThumbnail, setSeriesThumbPreview, seriesThumbPreview)}
                      className="hidden" disabled={isLoading} />
                    <label htmlFor="series-thumb"
                      className="w-full flex flex-col items-center justify-center p-5 comic-border-thin rounded-xl border-dashed border-2 bg-slate-50 border-slate-300 hover:bg-slate-100 cursor-pointer transition-all">
                      <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">add_photo_alternate</span>
                      <span className="text-sm font-bold text-slate-500">Upload series poster (optional)</span>
                    </label>
                  </>
                )}
              </div>
              <button type="submit" disabled={isLoading || !seriesTitle}
                className={`w-full py-4 rounded-xl font-black uppercase text-lg comic-border-thin transition-all flex items-center justify-center gap-2
                  ${isLoading || !seriesTitle ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-comic-primary hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900"}`}>
                {isLoading ? <><span className="material-symbols-outlined animate-spin">refresh</span>Creating...</> : <><span className="material-symbols-outlined">add_circle</span>Create Series</>}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: Upload Episode ── */}
        {step === "episode" && (
          <div className="bg-white comic-border rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-comic-primary">cloud_upload</span>
              Upload Episode
            </h2>
            <form onSubmit={handleUploadEpisode} className="space-y-5">
              {/* Select Series */}
              <div>
                <label className="block text-sm font-black uppercase mb-2">Select Series *</label>
                <select value={selectedSeriesId} onChange={e => setSelectedSeriesId(e.target.value)}
                  className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold bg-white" disabled={isLoading}>
                  <option value="">— Choose a series —</option>
                  {mySeries.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase mb-2">Episode No. *</label>
                  <input type="number" min="1" value={epNumber} onChange={e => setEpNumber(e.target.value)}
                    placeholder="1" className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold" disabled={isLoading} />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase mb-2">Episode Title</label>
                  <input type="text" value={epTitle} onChange={e => setEpTitle(e.target.value)}
                    placeholder="The Beginning"
                    className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold" disabled={isLoading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black uppercase mb-2">Episode Description</label>
                <textarea value={epDescription} onChange={e => setEpDescription(e.target.value)}
                  placeholder="What happens in this episode..." rows={2}
                  className="w-full comic-border-thin rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-200 font-bold resize-none" disabled={isLoading} />
              </div>
              {/* Episode Thumbnail */}
              <div>
                <label className="block text-sm font-black uppercase mb-2">
                  Episode Thumbnail <span className="text-slate-400 normal-case font-bold text-xs">(optional · auto-generated if skipped)</span>
                </label>
                {epThumbPreview ? (
                  <div className="relative rounded-xl overflow-hidden comic-border-thin aspect-video bg-slate-900">
                    <img src={epThumbPreview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setEpThumbnail(null); setEpThumbPreview(null); if (epThumbnailRef.current) epThumbnailRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-slate-900 text-white rounded-full p-1 hover:bg-red-600">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <input type="file" accept="image/*" ref={epThumbnailRef} id="ep-thumb"
                      onChange={e => handleThumb(e, setEpThumbnail, setEpThumbPreview, epThumbPreview)}
                      className="hidden" disabled={isLoading} />
                    <label htmlFor="ep-thumb"
                      className="w-full flex flex-col items-center justify-center p-5 comic-border-thin rounded-xl border-dashed border-2 bg-slate-50 border-slate-300 hover:bg-slate-100 cursor-pointer transition-all">
                      <span className="material-symbols-outlined text-3xl text-slate-400 mb-1">add_photo_alternate</span>
                      <span className="text-sm font-bold text-slate-500">Upload episode thumbnail</span>
                    </label>
                  </>
                )}
              </div>
              {/* Video File */}
              <div>
                <label className="block text-sm font-black uppercase mb-2">Video File * (Max 1GB)</label>
                <input type="file" accept="video/*" ref={videoFileRef} id="ep-video"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (!f.type.startsWith("video/")) { setError("Select a valid video file."); return; }
                    if (f.size > 1024 * 1024 * 1024) { setError("File exceeds 1GB."); return; }
                    setEpFile(f);
                  }}
                  className="hidden" disabled={isLoading} />
                <label htmlFor="ep-video"
                  className={`w-full flex flex-col items-center justify-center p-8 comic-border-thin rounded-xl border-dashed border-2 cursor-pointer transition-all
                    ${epFile ? "bg-yellow-50 border-comic-primary" : "bg-slate-50 border-slate-300 hover:bg-slate-100"}
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <span className="material-symbols-outlined text-5xl mb-2 text-slate-400">{epFile ? "movie" : "cloud_upload"}</span>
                  <span className="font-black text-slate-700 text-center">
                    {epFile ? <span className="text-comic-primary">{epFile.name}</span> : "Click to select a video"}
                  </span>
                  {epFile && <span className="text-sm text-slate-400 mt-1">{(epFile.size / (1024 * 1024)).toFixed(2)} MB</span>}
                </label>
              </div>
              <button type="submit" disabled={isLoading || !selectedSeriesId || !epNumber || !epFile}
                className={`w-full py-4 rounded-xl font-black uppercase text-lg comic-border-thin transition-all flex items-center justify-center gap-2
                  ${isLoading || !selectedSeriesId || !epNumber || !epFile ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-comic-primary hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900"}`}>
                {isLoading ? <><span className="material-symbols-outlined animate-spin">refresh</span>Uploading...</> : <><span className="material-symbols-outlined">cloud_upload</span>Upload Episode</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
