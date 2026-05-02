"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import type { Category } from "@/lib/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

const STYLES = [
  { bg: "bg-comic-red", icon: "bolt", iconColor: "text-comic-red", titleColor: "text-white", descColor: "text-white/90" },
  { bg: "bg-comic-blue", icon: "rocket_launch", iconColor: "text-comic-blue", titleColor: "text-white", descColor: "text-white/90" },
  { bg: "bg-comic-primary", icon: "auto_stories", iconColor: "text-slate-900", titleColor: "text-slate-900", descColor: "text-slate-800" },
  { bg: "bg-purple-500", icon: "star", iconColor: "text-purple-500", titleColor: "text-white", descColor: "text-white/90" },
  { bg: "bg-green-500", icon: "explore", iconColor: "text-green-500", titleColor: "text-white", descColor: "text-white/90" },
];

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/categories`);
        const data = await res.json();
        if (data.success && data.data) {
          const mappedCategories = data.data.map((genre: any, i: number) => {
            const style = STYLES[i % STYLES.length];
            return {
              ...style,
              title: genre.name,
              description: `Explore the best of ${genre.name}.`,
            };
          });
          setCategories(mappedCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchGenres();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-black italic uppercase mb-6">Browse by Genre</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div
            key={category.title}
            className={`${category.bg} ${category.titleColor} px-5 py-2.5 rounded-full font-bold uppercase text-sm border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all`}
          >
            {category.title}
          </div>
        ))}
      </div>
    </section>
  );
}

