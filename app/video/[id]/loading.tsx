export default function VideoDetailLoading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900 animate-pulse">
      {/* Header placeholder */}
      <div className="h-[73px] border-b-4 border-slate-900 bg-white" />

      <main className="flex flex-1 flex-col lg:flex-row p-6 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Player skeleton */}
        <div className="flex-[3] flex flex-col gap-6 min-w-0">
          <div className="comic-border bg-slate-300 rounded-xl aspect-video" />
          <div className="flex flex-col gap-3">
            <div className="h-10 bg-slate-300 rounded-lg w-3/4" />
            <div className="flex gap-3">
              <div className="h-7 w-20 bg-slate-300 rounded" />
              <div className="h-7 w-20 bg-slate-300 rounded" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-full mt-2" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <aside className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="bg-white comic-border p-4 rounded-xl flex flex-col gap-6">
            <div className="h-6 bg-slate-300 rounded w-1/3" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-32 aspect-video bg-slate-300 rounded-lg shrink-0" />
                <div className="flex-1 bg-slate-200 rounded-xl" />
              </div>
            ))}
            <div className="h-12 bg-slate-300 rounded-lg mt-2" />
          </div>
          <div className="h-20 bg-slate-300 comic-border rounded-xl" />
        </aside>
      </main>
    </div>
  );
}
