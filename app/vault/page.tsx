import { Metadata } from "next";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import VaultView from "./VaultView";

export const metadata: Metadata = {
  title: "The Vault",
  description: "Your personal NadaSaku watchlist and saved collection.",
};

export default function VaultPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden halftone-bg font-display text-slate-900">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-12 flex flex-col gap-10">
        {/* ── Page Title ── */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">My Vault</h1>
          <p className="font-bold text-slate-600 text-lg">
            Your personal collection. Save anything, watch it any time.
          </p>
        </div>

        <VaultView />
      </main>

      <Footer />
    </div>
  );
}
