import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className={`category-card ${category.bg} comic-border p-6 rounded-2xl cursor-pointer`}>
      <div className="flex flex-col gap-4">
        {/* Icon box */}
        <div className="bg-white comic-border-thin size-14 rounded-xl flex items-center justify-center">
          <span className={`material-symbols-outlined ${category.iconColor} text-3xl font-black`}>
            {category.icon}
          </span>
        </div>

        <h4 className={`text-3xl font-black ${category.titleColor} italic uppercase tracking-tighter`}>
          {category.title}
        </h4>

        <p className={`${category.descColor} font-bold`}>{category.description}</p>
      </div>
    </div>
  );
}
