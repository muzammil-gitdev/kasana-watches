"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus, Search, Edit3, Trash2, X, Upload, Package, Star, Eye,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  getDocs, query, orderBy, serverTimestamp 
} from "firebase/firestore";

function formatPrice(v) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(v);
}

const emptyProduct = {
  name: "", price: "", originalPrice: "", category: "men",
  description: "", isNew: false, isSale: false, isVisible: true,
  rating: "", reviews: "",
  image: "", images: [],
  features: [""],
  specs: { caseMaterial: "", caseSize: "", dialColor: "", strapMaterial: "", movement: "", waterResistance: "", warranty: "" },
};

/* ── Form Component ──────────────────────────────────────── */
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(product || { ...emptyProduct });
  const [previewImages, setPreviewImages] = useState(product?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef(null);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setSpec = (key, val) => setForm((p) => ({ ...p, specs: { ...p.specs, [key]: val } }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const newImages = [...form.images];
    const newPreviews = [...previewImages];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
          newPreviews.push(data.url);
        }
      }

      setPreviewImages(newPreviews);
      setForm((p) => ({ ...p, images: newImages, image: newImages[0] || "" }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx) => {
    setPreviewImages((p) => p.filter((_, i) => i !== idx));
    setForm((p) => {
      const imgs = p.images.filter((_, i) => i !== idx);
      return { ...p, images: imgs, image: imgs[0] || "" };
    });
  };

  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, ""] }));
  const updateFeature = (i, v) => setForm((p) => {
    const f = [...p.features]; f[i] = v; return { ...p, features: f };
  });
  const removeFeature = (i) => setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors text-sm";
  const labelCls = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-xl font-serif font-bold text-white">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
      </div>

      <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
        {/* ─ Images ─ */}
        <section>
          <label className={labelCls}>Product Images *</label>
          <div className="flex flex-wrap gap-4">
            {previewImages.map((src, i) => (
              <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/10 group">
                <Image src={src} alt="" fill className="object-cover" />
                <button onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} className="text-red-400" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-gold text-black px-1.5 py-0.5 rounded-full font-bold">Main</span>}
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="w-28 h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-gold/40 flex flex-col items-center justify-center text-gray-500 hover:text-gold transition-all">
              <Upload size={20} />
              <span className="text-xs mt-1">Upload</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </div>
        </section>

        {/* ─ Basic Info ─ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input className={inputCls} placeholder="e.g. Chronograph Elite" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="couples">Couples</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Price (PKR) *</label>
            <input className={inputCls} type="number" placeholder="24999" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Original Price (PKR)</label>
            <input className={inputCls} type="number" placeholder="Optional – for sale items" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Rating</label>
            <input className={inputCls} type="number" step="0.1" min="0" max="5" placeholder="4.8" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Reviews Count</label>
            <input className={inputCls} type="number" placeholder="124" value={form.reviews} onChange={(e) => set("reviews", e.target.value)} />
          </div>
        </section>

        {/* ─ Toggles ─ */}
        <section className="flex flex-wrap gap-6">
          {[
            { key: "isNew", label: "Mark as New" }, 
            { key: "isSale", label: "On Sale" },
            { key: "isVisible", label: "Active/Visible" }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? "bg-gold" : "bg-white/10"}`}
                onClick={() => set(key, !form[key])}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form[key] ? "left-[22px]" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </section>

        {/* ─ Description ─ */}
        <section>
          <label className={labelCls}>Description *</label>
          <textarea className={`${inputCls} min-h-[120px] resize-none`} placeholder="Describe the watch..." value={form.description}
            onChange={(e) => set("description", e.target.value)} />
        </section>

        {/* ─ Features ─ */}
        <section>
          <label className={labelCls}>Features</label>
          <div className="space-y-3">
            {form.features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input className={`${inputCls} flex-1`} placeholder={`Feature ${i + 1}`} value={f} onChange={(e) => updateFeature(i, e.target.value)} />
                {form.features.length > 1 && (
                  <button onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-400"><X size={16} /></button>
                )}
              </div>
            ))}
            <button onClick={addFeature} className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1">
              <Plus size={14} /> Add Feature
            </button>
          </div>
        </section>

        {/* ─ Specifications ─ */}
        <section>
          <label className={labelCls}>Specifications</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["caseMaterial", "Case Material"],
              ["caseSize", "Case Size"],
              ["dialColor", "Dial Color"],
              ["strapMaterial", "Strap Material"],
              ["movement", "Movement"],
              ["waterResistance", "Water Resistance"],
              ["warranty", "Warranty"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input className={inputCls} placeholder={label} value={form.specs[key]} onChange={(e) => setSpec(key, e.target.value)} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 p-6 border-t border-white/10">
        <button onClick={onCancel} disabled={isSaving || isUploading} className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button 
          onClick={async () => {
            setIsSaving(true);
            try {
              await onSave(form);
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving || isUploading}
          className="px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-gold to-gold-dark text-black hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Products Manager ────────────────────────────────────── */
export default function ProductsManager() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get("action") === "add");
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleSave = async (productData) => {
    try {
      const cleanData = {
        ...productData,
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        rating: parseFloat(productData.rating) || 0,
        reviews: parseInt(productData.reviews) || 0,
        updatedAt: serverTimestamp(),
      };

      if (editProduct) {
        const productRef = doc(db, "products", editProduct.id);
        await updateDoc(productRef, cleanData);
      } else {
        cleanData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, "products"), cleanData);
        
        // Trigger newsletter for new product
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productName: cleanData.name }),
        }).catch(err => console.error("Newsletter trigger failed:", err));
      }

      await fetchProducts();
      setShowForm(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      await fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage your watch inventory</p>
        </div>
        {!showForm && (
          <button onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-black text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editProduct}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditProduct(null); }}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search products..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 transition-colors" />
          </div>
          <div className="flex gap-2">
            {["all", "men", "women", "couples"].map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border capitalize ${
                  categoryFilter === cat
                    ? "bg-gold/10 border-gold/30 text-gold"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}>
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div key={`${p.category}-${p.id}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all group">
              <div className="relative h-52 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.isNew && <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">New</span>}
                  {p.isSale && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Sale</span>}
                  {!p.isVisible && <span className="bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Hidden</span>}
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)}
                    className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:text-gold transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:text-red-400 transition-colors"
                    onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded-full capitalize">{p.category}</span>
                  <div className="flex items-center gap-1 text-gold text-xs">
                    <Star size={10} fill="currentColor" /> {p.rating}
                  </div>
                </div>
                <h3 className="font-serif text-white text-lg mb-2">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gold font-semibold">{formatPrice(p.price)}</span>
                  {p.originalPrice && <span className="text-gray-500 text-sm line-through">{formatPrice(p.originalPrice)}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!showForm && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}
