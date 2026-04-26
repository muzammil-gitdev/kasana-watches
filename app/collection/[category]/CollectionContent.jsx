"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import WatchCard from "@/components/WatchCard";
import {
    categoryTitles,
    categoryDescriptions,
    categoryHeroImages,
    sortOptions,
} from "@/lib/constants";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useEffect } from "react";

export default function CollectionContent({ category }) {
    const [sortBy, setSortBy] = useState("featured");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [showOnlySale, setShowOnlySale] = useState(false);
    const [showOnlyNew, setShowOnlyNew] = useState(false);

    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const title = categoryTitles[category] || "Collection";
    const description = categoryDescriptions[category] || "";
    const heroImage = categoryHeroImages[category] || categoryHeroImages.men;

    useEffect(() => {
        const fetchWatches = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "products"),
                    where("category", "==", category),
                    where("isVisible", "==", true)
                );
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWatches(items);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWatches();
    }, [category]);

    const filteredAndSortedWatches = useMemo(() => {
        let result = [...watches];

        // Apply filters
        result = result.filter(
            (watch) => watch.price >= priceRange[0] && watch.price <= priceRange[1]
        );

        if (showOnlySale) {
            result = result.filter((watch) => watch.isSale);
        }

        if (showOnlyNew) {
            result = result.filter((watch) => watch.isNew);
        }

        // Apply sorting
        switch (sortBy) {
            case "newest":
                // Prioritize new arrivals first, then the rest
                result = result.filter((watch) => watch.isNew).concat(result.filter((watch) => !watch.isNew));
                break;
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [watches, sortBy, priceRange, showOnlySale, showOnlyNew]);

    return (
        <main className="min-h-screen bg-background pt-0">
            {/* Hero Banner */}
            <section className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10" />
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <nav className="text-sm text-gray-400 mb-4">
                            <Link href="/" className="hover:text-gold transition-colors">
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gold">{title}</span>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{title}</h1>
                        <div className="w-24 h-1 bg-gold mx-auto mb-6" />
                        <p className="text-gray-300 max-w-xl mx-auto">{description}</p>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Products */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-white hover:border-gold hover:text-gold transition-colors"
                            >
                                <SlidersHorizontal size={18} />
                                Filters
                            </button>
                            <span className="text-gray-400">
                                {filteredAndSortedWatches.length} products
                            </span>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-charcoal/50 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white focus:border-gold focus:outline-none cursor-pointer"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={18}
                            />
                        </div>
                    </div>

                    {/* Filter Panel */}
                    <motion.div
                        initial={false}
                        animate={{ height: isFilterOpen ? "auto" : 0, opacity: isFilterOpen ? 1 : 0 }}
                        className="overflow-hidden mb-8"
                    >
                        <div className="bg-charcoal/30 border border-white/10 rounded-xl p-6">
                            <div className="flex flex-wrap gap-8">
                                {/* Price Range */}
                                <div className="flex-1 min-w-[200px]">
                                    <h4 className="text-white font-medium mb-4">Price Range</h4>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) =>
                                                setPriceRange([Number(e.target.value), priceRange[1]])
                                            }
                                            className="w-24 bg-black/30 border border-white/20 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                                            placeholder="Min"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([priceRange[0], Number(e.target.value)])
                                            }
                                            className="w-24 bg-black/30 border border-white/20 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="flex-1 min-w-[200px]">
                                    <h4 className="text-white font-medium mb-4">Quick Filters</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setShowOnlySale(!showOnlySale)}
                                            className={`px-4 py-2 rounded-full text-sm transition-colors ${showOnlySale
                                                ? "bg-gold text-black"
                                                : "border border-white/20 text-white hover:border-gold"
                                                }`}
                                        >
                                            On Sale
                                        </button>
                                        <button
                                            onClick={() => setShowOnlyNew(!showOnlyNew)}
                                            className={`px-4 py-2 rounded-full text-sm transition-colors ${showOnlyNew
                                                ? "bg-gold text-black"
                                                : "border border-white/20 text-white hover:border-gold"
                                                }`}
                                        >
                                            New Arrivals
                                        </button>
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setPriceRange([0, 100000]);
                                            setShowOnlySale(false);
                                            setShowOnlyNew(false);
                                        }}
                                        className="text-gold hover:text-gold-light transition-colors flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedWatches.map((watch, index) => (
                                <WatchCard key={watch.id} watch={watch} index={index} category={category} />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {filteredAndSortedWatches.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-gray-400 text-lg mb-4">
                                No watches found matching your filters.
                            </p>
                            <button
                                onClick={() => {
                                    setPriceRange([0, 100000]);
                                    setShowOnlySale(false);
                                    setShowOnlyNew(false);
                                }}
                                className="text-gold hover:text-gold-light transition-colors"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
