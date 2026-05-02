"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Hls from "hls.js";

interface VideoPlayerProps {
  thumbnail?: string;
  alt?: string;
  src?: string; // HLS url or mp4 url
}

export default function VideoPlayer({ thumbnail, alt, src }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);   // percent 0-100
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format time
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Initialize HLS.js
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    if (Hls.isSupported() && src.includes(".m3u8")) {
      hls = new Hls({
        capLevelToPlayerSize: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
    } else {
      // Fallback for direct MP4
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    setCurrentTime(formatTime(currentTime));
    setProgress((currentTime / duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !videoRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setProgress(pct * 100);
  }, []);

  // Controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleMouseLeave = () => {
    if (playing) setShowControls(false);
  };

  // Ensure controls stay visible when paused
  useEffect(() => {
    if (!playing) setShowControls(true);
  }, [playing]);

  return (
    <div 
      className="relative comic-border bg-black rounded-xl overflow-hidden aspect-video group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Native Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        poster={thumbnail}
        playsInline
      />

      {/* Center play button (shown when paused) */}
      {!playing && (
        <button
          onClick={handlePlayPause}
          className="absolute z-10 inset-0 flex items-center justify-center bg-black/30 transition-all"
          aria-label="Play video"
        >
          <span className="bg-comic-primary hover:scale-110 transition-transform comic-border rounded-full size-24 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl font-black text-slate-900">
              play_arrow
            </span>
          </span>
        </button>
      )}

      {/* Bottom controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col gap-4">

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-sm tabular-nums">{currentTime}</span>

            {/* Track */}
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              className="relative flex-1 h-3 bg-slate-700 comic-border-thin rounded-full overflow-visible cursor-pointer group/track"
              role="slider"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* Filled portion */}
              <div
                className="absolute top-0 left-0 h-full bg-comic-primary rounded-full pointer-events-none"
                style={{ width: `${progress}%` }}
              />
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white comic-border-thin rounded-full size-4 flex items-center justify-center pointer-events-none opacity-0 group-hover/track:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>

            <span className="text-white font-bold text-sm tabular-nums">{duration}</span>
          </div>

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="bg-white comic-border-thin p-2 rounded-lg hover:bg-comic-primary transition-colors"
                aria-label={playing ? "Pause" : "Play"}
              >
                <span className="material-symbols-outlined font-bold">
                  {playing ? "pause" : "play_arrow"}
                </span>
              </button>
              <button 
                className="bg-white comic-border-thin p-2 rounded-lg hover:bg-comic-primary transition-colors" 
                aria-label="Rewind"
                onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10; }}
              >
                <span className="material-symbols-outlined font-bold">replay_10</span>
              </button>
              <button 
                className="bg-white comic-border-thin p-2 rounded-lg hover:bg-comic-primary transition-colors" 
                aria-label="Fast forward"
                onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}
              >
                <span className="material-symbols-outlined font-bold">forward_10</span>
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <button 
                className="bg-white comic-border-thin p-2 rounded-lg hover:bg-comic-primary transition-colors" 
                aria-label="Fullscreen"
                onClick={() => {
                  if (videoRef.current) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      videoRef.current.parentElement?.requestFullscreen();
                    }
                  }
                }}
              >
                <span className="material-symbols-outlined font-bold">fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
