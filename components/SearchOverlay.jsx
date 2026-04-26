"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Star, Tag } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { categoryTitles } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";


export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products for search
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(items);
      } catch (error) {
        console.error("Search fetch error:", error);
      }
    };
    if (isOpen) fetchAll();
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Search logic — matches name, category, description, features, specs
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter((p) => {
      const searchable = [
        p.name,
        p.category,
        p.description,
        ...(p.features || []),
        ...(p.specs ? Object.values(p.specs) : []),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [query, allProducts]);

  const handleSelect = (product) => {
    onClose();
    router.push(`/product/${product.category}/${product.id}`);
  };

  // Quick category suggestions
  const categories = Object.keys(categoryTitles);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl mt-20 mx-4 z-10"
          >
            <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <Search size={20} className="text-gold shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search watches by name, category, features..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white text-lg placeholder:text-gray-500 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 border border-white/10 rounded-lg px-2 py-1 hover:text-white hover:border-white/20 transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results / Suggestions */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Empty state — show category suggestions */}
                {!query.trim() && (
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-4">
                      Browse Categories
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setQuery(cat)}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                        >
                          <Tag
                            size={14}
                            className="text-gray-500 group-hover:text-gold transition-colors"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white capitalize transition-colors">
                            {categoryTitles[cat] || cat}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-4 text-center">
                      Try searching for &quot;gold&quot;, &quot;automatic&quot;,
                      &quot;sapphire&quot;, or &quot;titanium&quot;
                    </p>
                  </div>
                )}

                {/* Results */}
                {query.trim() && results.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium px-3 py-2">
                      {results.length} result{results.length !== 1 && "s"} found
                    </p>
                    {results.map((product, i) => (
                      <motion.button
                        key={`${product.category}-${product.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSelect(product)}
                        className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-white/[0.05] transition-all group text-left"
                      >
                        {/* Image */}
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-sm font-medium text-white truncate group-hover:text-gold transition-colors">
                              {product.name}
                            </h4>
                            {product.isNew && (
                              <span className="text-[9px] bg-gold text-black px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0">
                                New
                              </span>
                            )}
                            {product.isSale && (
                              <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0">
                                Sale
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-500 capitalize">
                              {categoryTitles[product.category]}
                            </span>
                            <span className="flex items-center gap-1 text-gold/70">
                              <Star size={10} fill="currentColor" />
                              {product.rating}
                            </span>
                          </div>
                        </div>

                        {/* Price + Arrow */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gold">
                              {formatPrice(product.price)}
                            </p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-gray-600 group-hover:text-gold group-hover:translate-x-1 transition-all"
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query.trim() && results.length === 0 && (
                  <div className="p-12 text-center">
                    <Search
                      size={40}
                      className="mx-auto mb-4 text-gray-700"
                    />
                    <p className="text-gray-400 text-lg mb-1">No results found</p>
                    <p className="text-gray-600 text-sm">
                      Try a different keyword like &quot;rose gold&quot; or
                      &quot;leather&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
