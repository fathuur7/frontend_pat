"use client";

import React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function LoginPage() {
    const { 
        showPassword, 
        togglePasswordVisibility, 
        isLoading,
        error,
        email, setEmail,
        password, setPassword,
        handleFormSubmit 
    } = useAuthForm('login');

    return (
        <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-6 text-slate-900 font-sans">

            {/* Brand Logo */}
            <div className="mb-10 transform -rotate-2 hover:scale-110 transition-transform duration-200">
                <Link href="/" className="flex items-center gap-2 font-bubbly font-black italic text-5xl brand-text text-white">
                    <span className="text-comic-red">Nada</span>
                    <span className="text-comic-blue">Saku</span>
                </Link>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md">
                <div className="bg-white comic-border rounded-2xl p-8 relative">


                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black uppercase italic tracking-wider">Welcome Back!</h1>
                        <p className="text-lg font-bold text-slate-500 mt-2">Ready for the next episode?</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border-4 border-slate-900 rounded-lg text-red-600 font-bold uppercase text-sm italic tracking-wide">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wide text-slate-800" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hero@nadasaku.com"
                                className="w-full px-4 py-3 border-4 border-slate-900 rounded-lg bg-yellow-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#181811] font-bold text-lg transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-sm font-black uppercase tracking-wide text-slate-800" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 border-4 border-slate-900 rounded-lg bg-yellow-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_#181811] font-bold text-lg transition-all placeholder:text-slate-400 font-mono tracking-widest"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-md transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 border-4 border-slate-900 rounded bg-white text-comic-primary focus:ring-0 cursor-pointer accent-slate-900" />
                                <span className="font-bold text-sm select-none group-hover:text-comic-red transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-bold text-sm text-comic-blue hover:text-comic-red underline decoration-2 underline-offset-4 transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full speech-bubble-btn text-xl ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? "LOADING..." : "ENTER THE STUDIO"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t-4 border-slate-900 border-dashed text-center">
                        <p className="font-bold text-slate-600">
                            New superhero around here?{' '}
                            <Link href="/register" className="text-comic-red hover:underline decoration-2 underline-offset-4 font-black italic uppercase">
                                Sign Up Now!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
