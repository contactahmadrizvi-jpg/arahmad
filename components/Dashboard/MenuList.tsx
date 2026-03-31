"use client";

import { MenuItem } from "@/lib/firestore";
import MenuCard from "../MenuCard";

interface Props {
  items: MenuItem[];
  restaurantId: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function MenuList({ items, restaurantId, onEdit, onDelete, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-white/5 rounded" />
                <div className="h-5 w-16 bg-white/5 rounded" />
              </div>
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
              <div className="flex gap-2 mt-4">
                <div className="h-10 flex-1 bg-white/5 rounded-xl" />
                <div className="h-10 w-10 bg-white/5 rounded-xl" />
                <div className="h-10 w-10 bg-white/5 rounded-xl" />
                <div className="h-10 w-10 bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-400">
            <path d="M18 6v24M6 18h24" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No dishes yet</h3>
        <p className="text-white/40 text-sm">Add your first dish to get started with AR menu</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          restaurantId={restaurantId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
