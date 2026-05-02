import Link from "next/link";

const platformLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Vault", href: "/vault" },
];

const supportLinks: { label: string; href: string }[] = [
  { label: "Help Center", href: "/support" },
  { label: "Device Setup", href: "/support#devices" },
  { label: "Contact Us", href: "/support#contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-slate-900 bg-white p-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* ── Brand ── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-comic-primary comic-border-thin p-1 rounded-lg">
              <span className="material-symbols-outlined text-2xl font-bold">movie_filter</span>
            </div>
            <h2 className="text-3xl font-black font-bubbly tracking-tight text-comic-red brand-text">
              NadaSaku
            </h2>
          </div>
          <p className="font-bold text-slate-600 leading-snug">
            The world&apos;s first premium streaming service built entirely for animation fans.
          </p>
          <div className="flex gap-4">
            <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center text-white cursor-pointer hover:bg-comic-blue transition-colors">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div className="size-10 bg-slate-900 rounded-lg flex items-center justify-center text-white cursor-pointer hover:bg-comic-red transition-colors">
              <span className="material-symbols-outlined">alternate_email</span>
            </div>
          </div>
        </div>

        {/* ── Platform links ── */}
        <div className="flex flex-col gap-4">
          <h5 className="font-black uppercase italic text-lg">Platform</h5>
          {platformLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="font-bold hover:text-comic-blue">
              {label}
            </Link>
          ))}
        </div>

        {/* ── Support links ── */}
        <div className="flex flex-col gap-4">
          <h5 className="font-black uppercase italic text-lg">Support</h5>
          {supportLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="font-bold hover:text-comic-blue">
              {label}
            </Link>
          ))}
        </div>

        {/* ── Newsletter ── */}
        <div className="flex flex-col gap-4">
          <h5 className="font-black uppercase italic text-lg">Newsletter</h5>
          <p className="font-bold text-sm text-slate-600">Get weekly updates on new releases!</p>
          <div className="flex flex-col gap-2">
            <input
              className="comic-border-thin p-2 text-sm font-bold uppercase"
              placeholder="YOUR EMAIL"
              type="email"
            />
            <button className="bg-comic-primary comic-border-thin py-2 font-black uppercase italic hover:opacity-80 transition-opacity">
              SUBSCRIBE!
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t-2 border-slate-200 flex justify-between items-center">
        <span className="text-sm font-black text-slate-500 uppercase">
          © 2024 NADASAKU MEDIA INC. - ALL RIGHTS RESERVED
        </span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">shield</span>
          <span className="material-symbols-outlined text-slate-400">verified_user</span>
        </div>
      </div>
    </footer>
  );
}
