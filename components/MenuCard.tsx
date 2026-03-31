"use client";

import { MenuItem } from "@/lib/firestore";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface Props {
  item: MenuItem;
  restaurantId: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export default function MenuCard({ item, restaurantId, onEdit, onDelete }: Props) {
  const [showQR, setShowQR] = useState(false);
  const arUrl = typeof window !== "undefined"
    ? `${window.location.origin}/menu/${restaurantId}_${item.id}/ar`
    : "";

  return (
    <div className="group relative bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.dishName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
              <rect x="4" y="4" width="40" height="40" rx="4" />
              <circle cx="16" cy="16" r="4" />
              <path d="M44 32L34 20L20 36" />
              <path d="M28 36L20 26L4 44" />
            </svg>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white/80 border border-white/10">
          {item.category}
        </div>
        {/* AR Views Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-violet-500/80 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4S1 6 1 6z" />
            <circle cx="6" cy="6" r="1.5" />
          </svg>
          {item.arViews || 0} views
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{item.dishName}</h3>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-white/50 mb-4 line-clamp-2">{item.description}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={arUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
          >
            View in AR
          </a>
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="QR Code"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="5" height="5" rx="1" />
              <rect x="11" y="2" width="5" height="5" rx="1" />
              <rect x="2" y="11" width="5" height="5" rx="1" />
              <rect x="11" y="11" width="5" height="5" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Edit"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4l3 3L6 15H3v-3L11 4z" />
            </svg>
          </button>
          <button
            onClick={() => item.id && onDelete(item.id)}
            className="p-2 rounded-xl bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h12M5 6v9a2 2 0 002 2h4a2 2 0 002-2V6M7 6V4a1 1 0 011-1h2a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-4 p-4 bg-white rounded-xl flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <QRCodeSVG value={arUrl} size={160} />
            <p className="text-xs text-gray-500 text-center">Scan to view in AR</p>
          </div>
        )}
      </div>
    </div>
  );
}
