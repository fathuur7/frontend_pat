"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "bar_chart" },
  { href: "/dashboard/videos", label: "My Videos", icon: "video_library" },
  { href: "/dashboard/upload", label: "Upload Video", icon: "cloud_upload" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("nadasaku_token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-yellow-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r-4 border-slate-900 flex flex-col shrink-0">
        <div className="p-6 border-b-4 border-slate-900">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-comic-primary comic-border-thin p-1 rounded-lg">
              <span className="material-symbols-outlined text-xl font-bold">movie_filter</span>
            </div>
            <span className="font-black font-bubbly text-xl text-slate-900">NadaSaku</span>
          </Link>
          <p className="text-xs font-bold text-slate-400 uppercase mt-2 ml-0.5">Creator Studio</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black text-sm uppercase transition-all
                  ${isActive
                    ? "bg-comic-primary text-slate-900 comic-border-thin shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                    : "text-slate-600 hover:bg-yellow-50 hover:text-slate-900"
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-4 border-slate-900">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-black text-sm uppercase text-slate-500 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
