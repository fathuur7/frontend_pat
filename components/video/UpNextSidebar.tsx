import Image from "next/image";
import Link from "next/link";
import type { Episode } from "@/lib/types";

interface UpNextSidebarProps {
  nextEpisodeId: string;
  episodes: Episode[];
}

export default function UpNextSidebar({ nextEpisodeId, episodes }: UpNextSidebarProps) {
  return (
    <aside className="flex-1 flex flex-col gap-6 min-w-0">

      {/* Episode list card */}
      <div className="bg-white comic-border p-4 rounded-xl">
        <h3 className="text-xl font-black uppercase italic mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined font-bold">list_alt</span> Up Next
        </h3>

        <div className="flex flex-col gap-6">
          {episodes.map((ep, i) => (
            <Link
              key={ep.id}
              href={`/video/${ep.id}`}
              className={`flex gap-4 group cursor-pointer ${i > 0 ? "opacity-80 hover:opacity-100" : ""} transition-opacity`}
            >
              {/* Thumbnail */}
              <div className="relative w-32 shrink-0 aspect-video comic-border-thin rounded-lg overflow-hidden">
                <Image
                  src={ep.thumbnail}
                  alt={ep.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white font-bold">play_arrow</span>
                </div>
              </div>

              {/* Speech bubble */}
              <div className="speech-bubble p-2 flex-1 group-hover:bg-comic-primary transition-colors duration-200">
                <p className="text-xs font-black uppercase text-slate-500 tracking-wide">
                  EPISODE {String(ep.episodeNumber).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold leading-tight">{ep.title}</p>
                <p className="text-xs text-slate-500 mt-1">{ep.duration}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Next episode CTA */}
        <Link
          href={`/video/${nextEpisodeId}`}
          className="w-full mt-6 bg-comic-primary hover:bg-comic-primary/80 comic-border rounded-lg py-3 flex items-center justify-center gap-2 font-black uppercase italic transition-all active:translate-y-0.5 block text-center"
        >
          <span className="material-symbols-outlined font-bold">keyboard_double_arrow_right</span>
          NEXT EPISODE
        </Link>
      </div>

      {/* Promo card */}
      <div className="bg-comic-primary comic-border p-4 rounded-xl flex items-center gap-4">
        <div className="bg-white rounded-full p-2 comic-border-thin shrink-0">
          <span className="material-symbols-outlined text-3xl font-bold">auto_stories</span>
        </div>
        <div>
          <p className="font-black italic uppercase leading-tight">READ THE COMIC!</p>
          <p className="text-sm font-bold text-slate-700">Original manga available now</p>
        </div>
      </div>
    </aside>
  );
}
