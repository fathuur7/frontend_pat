"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "MOVIES", href: "/movies" },
  { label: "VAULT", href: "/vault" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [userRole, setUserRole] = useState<string>("user");
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const token = localStorage.getItem("nadasaku_token");
    if (token) {
      setIsLoggedIn(true);
      try {
        // Simple JWT decode (payload is the second part)
        const payloadBase64 = token.split(".")[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        setUserRole(payloadJson.role || "user");
      } catch (e) {
        setUserRole("user");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole("user");
    }
  }, [pathname]); // re-check on each navigation

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleLogout() {
    localStorage.removeItem("nadasaku_token");
    setIsLoggedIn(false);
    setUserRole("user");
    setShowMenu(false);
    router.push("/");
    router.refresh();
  }

  async function handleUpgrade() {
    try {
      setIsUpgrading(true);
      const token = localStorage.getItem("nadasaku_token");
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      const res = await fetch(`${backendUrl}/api/users/upgrade`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success && data.data?.token) {
        // Save new token with updated role
        localStorage.setItem("nadasaku_token", data.data.token);
        setUserRole("content_creator");
        alert("Success! You are now a Content Creator.");
      } else {
        alert(data.message || "Upgrade failed.");
      }
    } catch (err) {
      alert("An error occurred during upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  }

  return (
    <header className="flex items-center justify-between border-b-4 border-slate-900 bg-white px-4 md:px-8 py-3 md:py-4 sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-12">
        {/* ── Logo ── */}
        <Link href="/" className="relative logo-container group">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="logo-glow absolute inset-0 bg-comic-primary/40 blur-xl rounded-full" />
              <div className="logo-element bg-comic-primary comic-border-thin p-1 rounded-lg relative z-10">
                <span className="material-symbols-outlined text-2xl md:text-3xl font-bold">movie_filter</span>
              </div>
            </div>
            <h1 className="logo-element text-2xl sm:text-3xl md:text-4xl font-black font-bubbly tracking-tight text-comic-red brand-text relative z-10">
              NadaSaku
            </h1>
          </div>
          <div className="logo-tooltip hidden sm:block absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="bg-slate-900 text-white text-[10px] font-black py-1 px-3 rounded-full whitespace-nowrap comic-border-thin shadow-none">
              PLAYFUL VIBES!
            </div>
          </div>
        </Link>
      </div>

      {/* ── Nav (Desktop) ── */}
      <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-lg font-black transition-colors border-b-4 ${
                  active
                    ? "border-comic-primary text-slate-900"
                    : "border-transparent hover:border-comic-primary hover:text-comic-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

      {/* ── Right: Search + Auth + Mobile Toggle ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        <form onSubmit={handleSearch} className="relative hidden lg:block">
          <input
            ref={searchRef}
            className="comic-border-thin rounded-lg py-2 px-4 pl-10 focus:ring-0 focus:outline-none w-72 text-sm font-bold uppercase bg-white"
            placeholder="SEARCH HEROES..."
            type="text"
          />
          <button type="submit" className="absolute left-3 top-2.5">
            <span className="material-symbols-outlined text-slate-900 font-bold">search</span>
          </button>
        </form>

        {mounted && (isLoggedIn ? (
          /* ── Logged In: Avatar + Dropdown ── */
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="size-10 md:size-12 rounded-full comic-border-thin overflow-hidden bg-comic-primary cursor-pointer hover:scale-105 transition-transform relative"
            >
              <span className="flex items-center justify-center h-full w-full text-lg md:text-xl font-black text-slate-900">
                <span className="material-symbols-outlined text-xl md:text-2xl">person</span>
              </span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 w-48 bg-white comic-border rounded-xl shadow-lg overflow-hidden z-50">
                {userRole === "content_creator" ? (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 font-black text-sm uppercase hover:bg-yellow-50 border-b-2 border-slate-900 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                      Creator Dashboard
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="w-full text-left px-4 py-3 font-black text-sm uppercase hover:bg-yellow-50 border-b-2 border-slate-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">star</span>
                      {isUpgrading ? "Upgrading..." : "Become a Creator"}
                    </span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-black text-sm uppercase hover:bg-red-50 text-comic-red transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Not Logged In: Login + Register Buttons ── */
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-black uppercase border-4 border-slate-900 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              LOGIN
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-block text-sm font-black uppercase border-4 border-slate-900 px-4 py-2 rounded-lg bg-comic-primary hover:bg-yellow-400 transition-colors"
            >
              JOIN FREE
            </Link>
          </div>
        ))}

        {/* ── Mobile Nav Toggle ── */}
        <button 
          className="lg:hidden comic-border-thin p-1.5 sm:p-2 rounded-lg bg-white ml-1 sm:ml-2"
          onClick={() => setShowMobileNav(!showMobileNav)}
        >
          <span className="material-symbols-outlined font-bold text-slate-900">
            {showMobileNav ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {showMobileNav && (
        <div className="absolute top-full left-0 right-0 bg-white border-b-4 border-slate-900 shadow-xl flex flex-col p-4 lg:hidden z-40">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              ref={searchRef}
              className="comic-border-thin rounded-lg py-3 px-4 pl-10 focus:ring-0 focus:outline-none w-full text-sm font-bold uppercase bg-slate-50"
              placeholder="SEARCH HEROES..."
              type="text"
            />
            <button type="submit" className="absolute left-3 top-3">
              <span className="material-symbols-outlined text-slate-900 font-bold">search</span>
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setShowMobileNav(false)}
                  className={`text-lg font-black uppercase p-3 rounded-lg comic-border-thin transition-colors ${
                    active
                      ? "bg-comic-primary text-slate-900"
                      : "bg-white hover:bg-yellow-50 text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            
            {!isLoggedIn && (
              <Link
                href="/register"
                onClick={() => setShowMobileNav(false)}
                className="text-lg font-black uppercase p-3 rounded-lg comic-border-thin bg-comic-red text-white text-center mt-2 sm:hidden"
              >
                JOIN FREE
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}


