import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface VideoSeries {
  id: string;
  title: string;
  thumbnailUrl?: string;
  genres?: { id: string; name: string }[];
  _count: { episodes: number };
  likes?: number;
}

interface VideoCardProps {
  series: VideoSeries;
}

export default function VideoCard({ series }: VideoCardProps) {
  const thumbSrc = series.thumbnailUrl
    ? series.thumbnailUrl.startsWith("http")
      ? series.thumbnailUrl
      : `${BACKEND_URL}${series.thumbnailUrl}`
    : null;

  const isMovie = series.genres?.some(g => g.name.toUpperCase() === "MOVIE");

  return (
    <Link href={`/series/${series.id}`} className="category-card group cursor-pointer flex flex-col gap-3">
      {/* Thumbnail */}
      <div className="relative comic-border-sm rounded-xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center">
        {thumbSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbSrc}
            alt={series.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-slate-500">movie</span>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
          {series.genres && series.genres.length > 0 ? (
            series.genres.slice(0, 2).map(g => (
              <div key={g.id} className="bg-comic-primary text-slate-900 px-2 py-0.5 rounded-md text-[10px] font-black comic-border-thin shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] uppercase truncate">
                {g.name}
              </div>
            ))
          ) : (
            <div className="bg-comic-primary text-slate-900 px-2 py-0.5 rounded-md text-[10px] font-black comic-border-thin shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] uppercase">
              SERIES
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          {series.likes !== undefined && (
            <div className="bg-comic-red text-white px-2 py-0.5 rounded-md text-[10px] font-black comic-border-thin flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">favorite</span>
              {series.likes.toLocaleString()}
            </div>
          )}
          {!isMovie && (
            <div className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-black comic-border-thin">
              {series._count?.episodes || 0} EPS
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="font-black uppercase italic text-lg leading-tight group-hover:text-comic-red line-clamp-2">
        {series.title}
      </p>
    </Link>
  );
}
