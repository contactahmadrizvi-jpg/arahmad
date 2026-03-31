"use client";

import { MenuItem } from "@/lib/firestore";

interface Props {
  items: MenuItem[];
}

export default function Analytics({ items }: Props) {
  const totalViews = items.reduce((sum, item) => sum + (item.arViews || 0), 0);
  const totalDishes = items.length;
  const avgPrice =
    totalDishes > 0
      ? items.reduce((sum, item) => sum + item.price, 0) / totalDishes
      : 0;
  const topDish = items.length > 0
    ? [...items].sort((a, b) => (b.arViews || 0) - (a.arViews || 0))[0]
    : null;

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const stats = [
    {
      label: "Total AR Views",
      value: totalViews.toLocaleString(),
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      color: "from-violet-500 to-fuchsia-500",
      shadow: "shadow-violet-500/20",
    },
    {
      label: "Total Dishes",
      value: totalDishes.toString(),
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      ),
      color: "from-emerald-500 to-green-500",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Avg. Price",
      value: `$${avgPrice.toFixed(2)}`,
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Categories",
      value: categories.length.toString(),
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      color: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg ${stat.shadow} text-white`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Dish */}
      {topDish && topDish.arViews > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
          <div className="flex items-center gap-4">
            {topDish.imageUrl && (
              <img
                src={topDish.imageUrl}
                alt={topDish.dishName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div>
              <p className="text-sm text-white/50">🏆 Most Popular Dish</p>
              <p className="text-lg font-semibold text-white">{topDish.dishName}</p>
              <p className="text-sm text-violet-400">{topDish.arViews} AR views</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#12121a] border border-white/5">
          <h3 className="text-sm font-medium text-white/50 mb-4">Dishes by Category</h3>
          <div className="space-y-3">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              const percentage = (catItems.length / totalDishes) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{cat}</span>
                    <span className="text-white/40">{catItems.length} dishes</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
