"use client";

import { useEffect, useState, useRef, use } from "react";
import { getMenuItem, getMenuItems, incrementArViews, MenuItem } from "@/lib/firestore";

interface PageProps {
  params: Promise<{ menuId: string }>;
}

export default function ARViewPage({ params }: PageProps) {
  const { menuId } = use(params);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const arSceneRef = useRef<HTMLDivElement>(null);
  const scriptsLoaded = useRef(false);

  // Parse menuId — format: restaurantId_menuItemId or just restaurantId
  const parts = menuId.split("_");
  const restaurantId = parts[0];
  const menuItemId = parts.length > 1 ? parts[1] : null;

  useEffect(() => {
    async function fetchData() {
      try {
        if (menuItemId) {
          // Single item
          const menuItem = await getMenuItem(restaurantId, menuItemId);
          if (menuItem) {
            setItem(menuItem);
            setSelectedItem(menuItem);
            // Track view
            incrementArViews(restaurantId, menuItemId);
          } else {
            setError("Dish not found");
          }
        } else {
          // Full menu
          const items = await getMenuItems(restaurantId);
          setAllItems(items);
          if (items.length > 0) {
            setSelectedItem(items[0]);
            // Track view for first item
            if (items[0].id) incrementArViews(restaurantId, items[0].id);
          }
        }
      } catch {
        setError("Failed to load menu data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [restaurantId, menuItemId]);

  // Load AR.js and A-Frame scripts
  const loadARScripts = async () => {
    if (scriptsLoaded.current) return;

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });

    try {
      await loadScript("https://aframe.io/releases/1.4.0/aframe.min.js");
      await loadScript("https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js");
      scriptsLoaded.current = true;
    } catch (err) {
      console.error("Failed to load AR scripts:", err);
    }
  };

  // Load scripts on mount instead of on button click to be ready
  useEffect(() => {
    loadARScripts();
    
    return () => {
      // Global cleanup when page unmounts
      const video = document.getElementById("arjs-video");
      if (video) video.remove();
      const style = document.body.style;
      style.overflow = "";
      document.documentElement.classList.remove("a-fullscreen");
      document.body.classList.remove("a-fullscreen");
    };
  }, []);

  // Cleanup when exiting AR mode
  useEffect(() => {
    if (!arMode) {
      const video = document.getElementById("arjs-video");
      if (video) video.remove();
      document.documentElement.classList.remove("a-fullscreen");
      document.body.classList.remove("a-fullscreen");
    }
  }, [arMode]);

  const enterAR = async () => {
    // Check for secure context and media device support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is only available over HTTPS or localhost. Please ensure you are using a secure connection.");
      return;
    }
    
    try {
      // Request camera permission upfront to verify access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // STOP the stream tracks immediately to release the camera hardware
      // This ensures A-Frame/AR.js can then open its own stream without a 'NotReadableError'
      stream.getTracks().forEach(track => track.stop());
      
      setArMode(true);
    } catch (err) {
      console.error("Camera permission denied:", err);
      alert("Camera permission is required to view the AR experience.");
    }
  };

  const displayItem = selectedItem || item;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060a]">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/40">Loading AR experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060a] p-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
            <circle cx="16" cy="16" r="12" />
            <path d="M16 10v6M16 20v.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-white/40 text-center">{error}</p>
      </div>
    );
  }

  // AR Mode — full-screen AR.js scene
  if (arMode && displayItem) {
    return (
      <div className="fixed inset-0 z-[100] bg-transparent" ref={arSceneRef}>
        {/* Custom style to ensure AR.js video is visible */}
        <style dangerouslySetInnerHTML={{ __html: `
          #arjs-video {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin-left: 0 !important;
            z-index: -1 !important;
            object-fit: contain !important;
            background: #000;
          }
          .a-canvas {
            z-index: 1 !important;
          }
          body {
            overflow: hidden !important;
            position: fixed;
            width: 100%;
          }
        `}} />

        {/* AR.js A-Frame Scene */}
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: `
              <a-scene
                embedded
                arjs="sourceType: webcam; sourceWidth: 1280; sourceHeight: 720; displayWidth: 1280; displayHeight: 720; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best; facingMode: environment"
                vr-mode-ui="enabled: false"
                renderer="antialias: true; alpha: true; logarithmicDepthBuffer: true; colorManagement: true"
                style="width: 100%; height: 100%;"
              >
                <a-assets>
                  <img id="dish-img" src="${displayItem.imageUrl}" crossorigin="anonymous" />
                </a-assets>

                <a-marker preset="hiro">
                  <!-- Dish image plane floating above the marker -->
                  <a-plane
                    src="#dish-img"
                    width="2"
                    height="2"
                    position="0 0.5 0"
                    rotation="-90 0 0"
                    material="transparent: true; opacity: 0.95"
                    animation="property: position; to: 0 0.7 0; dir: alternate; dur: 2000; easing: easeInOutSine; loop: true"
                  ></a-plane>

                  <!-- Price tag -->
                  <a-entity
                    text="value: $${displayItem.price.toFixed(2)}; color: #10b981; align: center; width: 3; font: roboto"
                    position="0 1.5 0"
                    rotation="-90 0 0"
                    animation="property: scale; from: 0.9 0.9 0.9; to: 1.1 1.1 1.1; dir: alternate; dur: 1500; easing: easeInOutQuad; loop: true"
                  ></a-entity>

                  <!-- Dish name -->
                  <a-entity
                    text="value: ${displayItem.dishName}; color: white; align: center; width: 4; font: roboto"
                    position="0 1.8 0"
                    rotation="-90 0 0"
                  ></a-entity>

                  <!-- Rotating ring effect -->
                  <a-torus
                    position="0 0.3 0"
                    rotation="-90 0 0"
                    radius="1.2"
                    radius-tubular="0.02"
                    color="#8b5cf6"
                    material="opacity: 0.5"
                    animation="property: rotation; to: -90 0 360; dur: 4000; easing: linear; loop: true"
                  ></a-torus>
                </a-marker>

                <a-entity camera></a-entity>
              </a-scene>
            `,
          }}
        />

        {/* AR Overlay UI */}
        <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => setArMode(false)}
            className="pointer-events-auto px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white text-sm font-medium border border-white/10"
          >
            ← Back
          </button>
          <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white/60 text-xs border border-white/10">
            Point camera at Hiro marker
          </div>
        </div>

        {/* Bottom info panel */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
          <div className="pointer-events-auto max-w-md mx-auto p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-3">
              {displayItem.imageUrl && (
                <img src={displayItem.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{displayItem.dishName}</h3>
                <p className="text-white/40 text-xs truncate">{displayItem.description}</p>
              </div>
              <span className="text-lg font-bold text-emerald-400">${displayItem.price.toFixed(2)}</span>
            </div>
            {displayItem.ingredients && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-white/40">
                  <span className="text-white/60 font-medium">Ingredients:</span> {displayItem.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Preview / Landing for AR
  const itemsToShow = menuItemId ? (displayItem ? [displayItem] : []) : allItems;

  return (
    <div className="min-h-screen bg-[#06060a] relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-500/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">AR Menu</h1>
          <p className="text-sm text-white/40">Explore dishes in augmented reality</p>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-8">
          {itemsToShow.map((menuItem) => (
            <button
              key={menuItem.id}
              onClick={() => {
                setSelectedItem(menuItem);
                if (menuItem.id) incrementArViews(restaurantId, menuItem.id);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                selectedItem?.id === menuItem.id
                  ? "bg-violet-500/10 border-violet-500/30"
                  : "bg-[#12121a] border-white/5 hover:border-white/10"
              }`}
            >
              {menuItem.imageUrl ? (
                <img src={menuItem.imageUrl} alt={menuItem.dishName} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{menuItem.dishName}</h3>
                <p className="text-xs text-white/40 truncate">{menuItem.description}</p>
                <p className="text-sm text-white/30 mt-1">{menuItem.category}</p>
              </div>
              <span className="text-lg font-bold text-emerald-400 shrink-0">${menuItem.price.toFixed(2)}</span>
            </button>
          ))}
        </div>

        {/* Selected Item Detail */}
        {displayItem && (
          <div className="mb-6 p-5 rounded-2xl bg-[#12121a] border border-white/5">
            {displayItem.imageUrl && (
              <img
                src={displayItem.imageUrl}
                alt={displayItem.dishName}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-white mb-1">{displayItem.dishName}</h2>
            <p className="text-sm text-white/40 mb-3">{displayItem.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/60">{displayItem.category}</span>
              <span className="text-xl font-bold text-emerald-400">${displayItem.price.toFixed(2)}</span>
            </div>
            {displayItem.ingredients && (
              <div className="p-3 rounded-xl bg-white/5 mb-4">
                <p className="text-xs text-white/60">
                  <span className="font-medium text-white/80">Ingredients:</span> {displayItem.ingredients}
                </p>
              </div>
            )}

            {/* Info Toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all mb-4"
            >
              {showInfo ? "▾ Hide Details" : "▸ Tap to view details"}
            </button>
            {showInfo && (
              <div className="px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10 text-sm text-white/60 space-y-1">
                <p><span className="text-white/80">Price:</span> ${displayItem.price.toFixed(2)}</p>
                <p><span className="text-white/80">Category:</span> {displayItem.category}</p>
                {displayItem.ingredients && <p><span className="text-white/80">Ingredients:</span> {displayItem.ingredients}</p>}
                <p><span className="text-white/80">AR Views:</span> {displayItem.arViews || 0}</p>
              </div>
            )}
          </div>
        )}

        {/* AR Launch Button */}
        {displayItem && (
          <button
            onClick={enterAR}
            className="w-full gradient-btn py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Launch AR Experience
          </button>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 rounded-2xl bg-[#12121a] border border-white/5">
          <h3 className="text-sm font-medium text-white/60 mb-3">How to use AR</h3>
          <ol className="space-y-2 text-xs text-white/40">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              Print or display a Hiro AR marker on your table
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              Tap &quot;Launch AR Experience&quot; and allow camera access
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              Point your camera at the marker to see the dish in AR
            </li>
          </ol>
        </div>

        {/* Hiro Marker Download */}
        <div className="mt-4 text-center">
          <a
            href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1v9M3 7l4 4 4-4M2 12h10" />
            </svg>
            Download Hiro Marker
          </a>
        </div>
      </div>
    </div>
  );
}
