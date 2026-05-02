interface VideoInfoProps {
  title: string;
  tags: string[];
  views?: number;
  likes?: number;
  liked?: boolean;
  description: string;
  onLike?: () => void;
  isLiking?: boolean;
  saved?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  rating?: number;
  reviewCount?: string;
}

const TAG_COLORS: Record<string, string> = {
  ACTION:   "bg-blue-500",
  "SCI-FI": "bg-red-500",
  COMEDY:   "bg-yellow-400 text-slate-900",
  FANTASY:  "bg-purple-500",
  HORROR:   "bg-slate-900",
};

export default function VideoInfo({
  title,
  tags,
  views = 0,
  likes = 0,
  liked = false,
  description,
  onLike,
  isLiking,
  saved = false,
  onSave,
  isSaving
}: VideoInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-slate-900">
        {title}
      </h1>

      {/* Tags + Stats + Like */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`${TAG_COLORS[tag?.toUpperCase()] ?? "bg-slate-700"} text-white font-bold px-3 py-1 comic-border-thin rounded text-xs md:text-sm`}
          >
            {tag}
          </span>
        ))}

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-slate-500 font-bold text-lg md:text-xl">
            visibility
          </span>
          <span className="font-bold text-xs md:text-sm text-slate-600">
            {views.toLocaleString()} views
          </span>
        </div>

        <button 
          onClick={onLike}
          disabled={isLiking}
          className={`flex items-center gap-1.5 px-3 py-1 comic-border-thin rounded-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            liked 
              ? "bg-red-500 text-white hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" 
              : "bg-comic-primary text-slate-900 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          }`}
          title={liked ? "Unlike series ini" : "Like series ini"}
        >
          <span 
            className="material-symbols-outlined font-bold text-lg md:text-xl" 
            style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span className="font-black text-xs md:text-sm">
            {likes.toLocaleString()} {liked ? "Liked!" : "Like"}
          </span>
        </button>

        <button 
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-1.5 px-3 py-1 comic-border-thin rounded-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            saved 
              ? "bg-slate-900 text-white hover:shadow-[2px_2px_0px_0px_rgba(241,245,249,1)]" 
              : "bg-white text-slate-900 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          }`}
          title={saved ? "Remove from Vault" : "Save to Vault"}
        >
          <span 
            className="material-symbols-outlined font-bold text-lg md:text-xl" 
            style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
          >
            bookmark
          </span>
          <span className="font-black text-xs md:text-sm uppercase">
            {saved ? "Saved" : "Save"}
          </span>
        </button>
      </div>

      <p className="text-base md:text-lg font-medium leading-snug mt-4 text-slate-700 max-w-3xl">
        {description}
      </p>
    </div>
  );
}
