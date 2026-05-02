import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import VideoGrid from "@/components/home/VideoGrid";
import CategoryCards from "@/components/home/CategoryCards";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col gap-8 md:gap-12 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <HeroBanner />
        <VideoGrid />
        <CategoryCards />
      </main>

      <Footer />
    </div>
  );
}
