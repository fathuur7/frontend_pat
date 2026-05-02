import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative comic-border rounded-2xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center bg-black">
      {/* Background image */}
      <Image
        alt="The Neon Vigilante Hero Action"
        fill
        priority
        className="object-cover opacity-80"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaFgbiT8JPgaspsh1cZJX7R8Ihn4EcNjvhm4Eyvo9T2gblhlFFIn2VWe0tBxN0tOzCvwF4iX1zR_T_GcvLu208a2lsxmm_zpVmIxGOpiza61r234ngP88Rx8yMgNzk6fgk-o1lfoFbFwyy8TZB7sjqpnAr5DJgoca8uSDfCWedFsR4KiCbUHsbrbHz2QJQ6Kfw9D9j-Oia_b1qGnxpb-jaPADmNK8JFPiy9QakzitpLeq84kEFuvjf5uDO5ll7jC3WkuoCAP68FGrG"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 py-10 md:px-12 md:py-16 flex flex-col items-start gap-4 md:gap-6 max-w-2xl">
        <div className="bg-comic-red text-white text-[10px] md:text-xs font-black px-3 py-1 md:px-4 md:py-1 comic-border-thin uppercase tracking-widest">
          Featured Series
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white italic leading-none tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          THE NEON
          <br />
          VIGILANTE
        </h2>

        <p className="text-base md:text-xl text-white font-bold max-w-lg leading-snug">
          Justice has a new glow. Watch the explosive season finale as Cyber-City faces its darkest
          hour yet.
        </p>

        <div className="pt-2 md:pt-4">
          <button className="speech-bubble-btn text-sm md:text-base">WATCH NOW!</button>
        </div>
      </div>
    </section>
  );
}
