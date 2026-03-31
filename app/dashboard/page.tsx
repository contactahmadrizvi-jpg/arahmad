"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurant,
  MenuItem,
  Restaurant,
} from "@/lib/firestore";
import MenuForm from "@/components/Dashboard/MenuForm";
import MenuList from "@/components/Dashboard/MenuList";
import Analytics from "@/components/Dashboard/Analytics";
import QRGenerator from "@/components/Dashboard/QRGenerator";

type Tab = "menu" | "analytics" | "qr";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("menu");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    // Only redirect if we are SURE the user is not logged in after loading finishes
    const timer = setTimeout(() => {
      if (!authLoading && !user) {
        console.log("No user found, redirecting to login");
        router.push("/login");
      }
    }, 500); // 500ms grace period for state to settle
    
    return () => clearTimeout(timer);
  }, [user, authLoading, router]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoadingItems(true);
    try {
      const [rest, menuItems] = await Promise.all([
        getRestaurant(user.uid),
        getMenuItems(user.uid),
      ]);
      setRestaurant(rest);
      setItems(menuItems);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoadingItems(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (data: Omit<MenuItem, "id" | "arViews" | "createdAt">) => {
    if (!user) return;
    await addMenuItem(user.uid, { ...data, arViews: 0 });
    setShowForm(false);
    fetchData();
  };

  const handleEdit = async (data: Omit<MenuItem, "id" | "arViews" | "createdAt">) => {
    if (!user || !editingItem?.id) return;
    await updateMenuItem(user.uid, editingItem.id, data);
    setEditingItem(null);
    fetchData();
  };

  const handleDelete = async (menuId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this dish?")) return;
    await deleteMenuItem(user.uid, menuId);
    fetchData();
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "menu",
      label: "Menu Items",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="12" height="12" rx="2" />
          <line x1="3" y1="9" x2="15" y2="9" />
          <line x1="9" y1="3" x2="9" y2="15" />
        </svg>
      ),
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 14V8M9 14V5M4 14v-3" />
        </svg>
      ),
    },
    {
      key: "qr",
      label: "QR Codes",
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="11" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="11" width="5" height="5" rx="1" />
          <rect x="11" y="11" width="5" height="5" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {restaurant?.name || "Dashboard"}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Manage your AR menu • {items.length} dish{items.length !== 1 ? "es" : ""}
            </p>
          </div>
          {activeTab === "menu" && (
            <button
              onClick={() => { setShowForm(true); setEditingItem(null); }}
              className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 2v12M2 8h12" />
              </svg>
              Add Dish
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-[#12121a] rounded-xl p-1 border border-white/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "menu" && (
          <MenuList
            items={items}
            restaurantId={user.uid}
            onEdit={openEdit}
            onDelete={handleDelete}
            loading={loadingItems}
          />
        )}
        {activeTab === "analytics" && <Analytics items={items} />}
        {activeTab === "qr" && <QRGenerator items={items} restaurantId={user.uid} />}

        {/* Form Modals */}
        {showForm && (
          <MenuForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}
        {editingItem && (
          <MenuForm
            initial={editingItem}
            onSubmit={handleEdit}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
}
