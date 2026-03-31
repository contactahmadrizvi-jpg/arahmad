"use client";

import { useState, useRef } from "react";
import { uploadToImgBB } from "@/lib/imgbb";
import { MenuItem } from "@/lib/firestore";

interface Props {
  initial?: MenuItem | null;
  onSubmit: (data: Omit<MenuItem, "id" | "arViews" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  "Appetizer", "Main Course", "Dessert", "Beverage",
  "Salad", "Soup", "Pasta", "Seafood", "Grill", "Special"
];

export default function MenuForm({ initial, onSubmit, onCancel }: Props) {
  const [dishName, setDishName] = useState(initial?.dishName || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [ingredients, setIngredients] = useState(initial?.ingredients || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(initial?.imageUrl || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !price || !category) return;
    setSubmitting(true);
    try {
      await onSubmit({
        dishName,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        ingredients,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#12121a] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-6">
          {initial ? "Edit Dish" : "Add New Dish"}
        </h2>

        {/* Image Upload */}
        <div
          className="relative w-full h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 transition-colors mb-5 cursor-pointer overflow-hidden group"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-white/30 group-hover:text-white/50 transition-colors">
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 8v24M8 20h24" />
              </svg>
              <span className="text-sm">Click to upload dish image</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Dish Name */}
        <div className="mb-4">
          <label className="block text-sm text-white/50 mb-1.5">Dish Name *</label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            placeholder="e.g. Grilled Salmon"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm text-white/50 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all resize-none"
            placeholder="Describe the dish..."
          />
        </div>

        {/* Price & Category row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
              placeholder="12.99"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#12121a]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <label className="block text-sm text-white/50 mb-1.5">Ingredients</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            placeholder="Salmon, olive oil, lemon, herbs..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : initial ? "Update Dish" : "Add Dish"}
          </button>
        </div>
      </form>
    </div>
  );
}
