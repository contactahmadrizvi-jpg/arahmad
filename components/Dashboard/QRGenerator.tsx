"use client";

import { QRCodeSVG } from "qrcode.react";
import { MenuItem } from "@/lib/firestore";
import { useRef } from "react";

interface Props {
  items: MenuItem[];
  restaurantId: string;
}

export default function QRGenerator({ items, restaurantId }: Props) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const menuUrl = `${baseUrl}/menu/${restaurantId}/ar`;
  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadQR = (url: string, name: string) => {
    const svg = document.querySelector(`[data-qr="${name}"]`) as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400);
      const link = document.createElement("a");
      link.download = `${name}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      {/* Full Menu QR */}
      <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5">
        <h3 className="text-lg font-semibold text-white mb-1">Full Menu QR Code</h3>
        <p className="text-sm text-white/40 mb-4">
          Share this QR code so customers can browse your entire AR menu
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            <QRCodeSVG
              value={menuUrl}
              size={180}
              data-qr="full-menu"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/30 break-all max-w-xs">{menuUrl}</p>
            <button
              onClick={() => downloadQR(menuUrl, "full-menu")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
            >
              Download QR Code
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(menuUrl)}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Individual Dish QR Codes */}
      {items.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Individual Dish QR Codes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref={canvasRef}>
            {items.map((item) => {
              const dishUrl = `${baseUrl}/menu/${restaurantId}_${item.id}/ar`;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4"
                >
                  <div className="bg-white p-2 rounded-lg shrink-0">
                    <QRCodeSVG
                      value={dishUrl}
                      size={80}
                      data-qr={`dish-${item.id}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.dishName}</p>
                    <p className="text-xs text-white/40 mb-2">${item.price.toFixed(2)}</p>
                    <button
                      onClick={() => downloadQR(dishUrl, `dish-${item.dishName}`)}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Download
                    </button>
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
