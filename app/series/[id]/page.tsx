import { notFound } from "next/navigation";
import Header from "@/components/home/Header";
import VideoPageFooter from "@/components/video/VideoPageFooter";
import SeriesView from "./SeriesView";

// Server-side fetch uses the internal URL (tidak lewat browser)
const BACKEND_URL = process.env.BACKEND_URL_INTERNAL 
  || process.env.NEXT_PUBLIC_API_URL 
  || "http://192.168.56.10:4000";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSeries(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/videos/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000), // timeout 8 detik
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return data.data;
  } catch (error) {
    console.error("Failed to fetch series details:", error);
    return null;
  }
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const series = await getSeries(id);

  if (!series) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />
      <SeriesView series={series} />
      <VideoPageFooter />
    </div>
  );
}
