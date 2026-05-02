import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-8 py-20 text-center">

        {/* ── Big KAPOW! ── */}
        <div className="relative select-none">
          <div
            className="w-72 h-72 bg-comic-primary flex items-center justify-center comic-border"
            style={{
              clipPath:
                "polygon(50% 0%, 63% 25%, 93% 10%, 79% 37%, 100% 50%, 79% 63%, 93% 90%, 63% 75%, 50% 100%, 37% 75%, 7% 90%, 21% 63%, 0% 50%, 21% 37%, 7% 10%, 37% 25%)",
            }}
          >
            <span className="text-5xl font-black font-bubbly leading-none tracking-tighter brand-text text-comic-red">
              404!
            </span>
          </div>
          {/* floating speech bubble */}
          <div className="absolute -top-10 -right-10 bg-white comic-border-thin rounded-2xl px-4 py-2 rotate-6">
            <span className="font-black text-xl uppercase italic">KAPOW!</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-5xl font-black font-bubbly">PAGE NOT FOUND</h1>
          <p className="font-bold text-slate-600 text-lg">
            Looks like this page got zapped by a villain! Maybe it was moved, deleted, or never
            existed in the first place.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-10 py-4 bg-comic-primary comic-border font-black uppercase italic text-lg hover:opacity-90 transition-opacity"
          >
            BACK TO HOME BASE
          </Link>
          <Link
            href="/movies"
            className="px-10 py-4 bg-white comic-border font-black uppercase italic text-lg hover:bg-comic-primary transition-colors"
          >
            BROWSE MOVIES
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
