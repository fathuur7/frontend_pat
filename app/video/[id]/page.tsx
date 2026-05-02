import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";
import UpNextSidebar from "@/components/video/UpNextSidebar";
import VideoPageFooter from "@/components/video/VideoPageFooter";
import { getVideoDetail, videoDetails } from "@/lib/data/videoDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Static params (pre-render all known video IDs) ────────────────────────────
export function generateStaticParams() {
  return Object.keys(videoDetails).map((id) => ({ id }));
}

// ── Dynamic metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoDetail(id);
  return {
    title: video.title,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      images: [{ url: video.src, alt: video.alt }],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function VideoDetailPage({ params }: PageProps) {
  const { id } = await params;

  const video = getVideoDetail(id);
  if (!video) notFound();

  const nextEpisode = video.episodes[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex flex-1 flex-col lg:flex-row p-6 gap-8 max-w-[1600px] mx-auto w-full">
        {/* ── Left: player + info ── */}
        <div className="flex-[3] flex flex-col gap-6 min-w-0">
          <VideoPlayer
            thumbnail={video.src}
            alt={video.alt}
            totalDuration={video.duration}
          />
          <VideoInfo
            title={video.title}
            tags={video.tags}
            rating={video.rating}
            reviewCount={video.reviewCount}
            description={video.description}
          />
        </div>

        {/* ── Right: sidebar ── */}
        <UpNextSidebar
          nextEpisodeId={nextEpisode?.id ?? id}
          episodes={video.episodes}
        />
      </main>

      <VideoPageFooter />
    </div>
  );
}
