"use client";

import React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface RegisterViewProps {
  showPassword: boolean;
  onTogglePassword: () => void;
  isLoading: boolean;
  error: string | null;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterView({
  showPassword,
  onTogglePassword,
  isLoading,
  error,
  name, setName,
  email, setEmail,
  password, setPassword,
  onSubmit,
}: RegisterViewProps) {
  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 text-slate-900 font-sans">
      {/* Brand Logo */}
      <div className="mb-4 transform hover:-rotate-2 transition-transform duration-200">
        <Link href="/" className="flex items-center gap-1 font-bubbly font-black italic text-4xl sm:text-5xl brand-text text-white">
          <span className="text-comic-red">Nada</span>
          <span className="text-comic-blue">Saku</span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md">
        <div className="bg-white comic-border rounded-2xl p-6 md:p-8 relative">

          <div className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-wider">Join The Squad!</h1>
            <p className="text-sm sm:text-base font-bold text-slate-500 mt-1">Become a legendary creator today.</p>
          </div>

          {error && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-slate-900 rounded-lg text-red-600 font-bold uppercase text-xs italic tracking-wide">
                  {error}
              </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-800" htmlFor="name">
                Hero Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border-4 border-slate-900 rounded-lg bg-yellow-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#181811] font-bold text-base transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-800" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@nadasaku.com"
                className="w-full px-4 py-2.5 border-4 border-slate-900 rounded-lg bg-yellow-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#181811] font-bold text-base transition-all placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-800" htmlFor="password">
                Secret Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-12 border-4 border-slate-900 rounded-lg bg-yellow-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#181811] font-bold text-base transition-all placeholder:text-slate-400 font-mono tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 border-4 border-slate-900 rounded bg-white text-comic-primary focus:ring-0 cursor-pointer accent-slate-900 shrink-0" />
                <span className="font-bold text-xs sm:text-sm select-none text-slate-600 leading-tight">
                  I swear to follow the <a href="#" className="text-comic-blue hover:text-comic-red underline decoration-2 underline-offset-4">Terms of Heroism</a> and the <a href="#" className="text-comic-blue hover:text-comic-red underline decoration-2 underline-offset-4">Privacy Code</a>.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full speech-bubble-btn px-6 py-3 text-lg bg-comic-primary hover:bg-yellow-400 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "LOADING..." : "CREATE MY IDENTITY"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t-4 border-slate-900 border-dashed text-center">
            <p className="font-bold text-sm sm:text-base text-slate-600">
              Already part of the squad?{' '}
              <Link href="/login" className="text-comic-blue hover:underline decoration-2 underline-offset-4 font-black italic uppercase">
                Sign In Here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
