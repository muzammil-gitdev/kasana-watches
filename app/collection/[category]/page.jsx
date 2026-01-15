"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { use } from "react";
import Footer from "@/components/Footer";

// Sample watch data - in a real app, this would come from an API
const watchesData = {
    men: [
        {
            id: 1,
            name: "Chronograph Elite",
            price: 24999,
            originalPrice: 29999,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=600",
            rating: 4.8,
            reviews: 124,
            isNew: true,
            isSale: false,
        },
        {
            id: 2,
            name: "Midnight Classic",
            price: 18999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=600",
            rating: 4.9,
            reviews: 89,
            isNew: false,
            isSale: false,
        },
        {
            id: 3,
            name: "Royal Automatic",
            price: 42999,
            originalPrice: 49999,
            image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=600",
            rating: 5.0,
            reviews: 201,
            isNew: false,
            isSale: true,
        },
        {
            id: 4,
            name: "Vintage Heritage",
            price: 31999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=600",
            rating: 4.7,
            reviews: 56,
            isNew: true,
            isSale: false,
        },
        {
            id: 5,
            name: "Sport Titanium",
            price: 27999,
            originalPrice: 32999,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600",
            rating: 4.6,
            reviews: 178,
            isNew: false,
            isSale: true,
        },
        {
            id: 6,
            name: "Executive Pro",
            price: 55999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600",
            rating: 4.9,
            reviews: 92,
            isNew: false,
            isSale: false,
        },
        {
            id: 7,
            name: "Urban Steel",
            price: 15999,
            originalPrice: 19999,
            image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=600",
            rating: 4.5,
            reviews: 245,
            isNew: false,
            isSale: true,
        },
        {
            id: 8,
            name: "Carbon Noir",
            price: 38999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
            rating: 4.8,
            reviews: 67,
            isNew: true,
            isSale: false,
        },
    ],
    women: [
        {
            id: 1,
            name: "Rose Gold Elegance",
            price: 22999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?auto=format&fit=crop&q=80&w=600",
            rating: 4.9,
            reviews: 156,
            isNew: true,
            isSale: false,
        },
        {
            id: 2,
            name: "Diamond Luxe",
            price: 65999,
            originalPrice: 75999,
            image: "https://images.unsplash.com/photo-1612347519529-5b3e1e3d9b8c?auto=format&fit=crop&q=80&w=600",
            rating: 5.0,
            reviews: 78,
            isNew: false,
            isSale: true,
        },
        {
            id: 3,
            name: "Pearl Classic",
            price: 28999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=600",
            rating: 4.8,
            reviews: 134,
            isNew: false,
            isSale: false,
        },
        {
            id: 4,
            name: "Silver Petite",
            price: 16999,
            originalPrice: 21999,
            image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600",
            rating: 4.7,
            reviews: 201,
            isNew: false,
            isSale: true,
        },
        {
            id: 5,
            name: "Sapphire Dream",
            price: 48999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1549972574-20eb06fac9cc?auto=format&fit=crop&q=80&w=600",
            rating: 4.9,
            reviews: 89,
            isNew: true,
            isSale: false,
        },
        {
            id: 6,
            name: "Velvet Night",
            price: 34999,
            originalPrice: 39999,
            image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
            rating: 4.6,
            reviews: 112,
            isNew: false,
            isSale: true,
        },
    ],
    couples: [
        {
            id: 1,
            name: "Eternal Bond Set",
            price: 45999,
            originalPrice: 54999,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600",
            rating: 5.0,
            reviews: 234,
            isNew: true,
            isSale: true,
        },
        {
            id: 2,
            name: "Classic Duo",
            price: 38999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=600",
            rating: 4.8,
            reviews: 167,
            isNew: false,
            isSale: false,
        },
        {
            id: 3,
            name: "Harmony Collection",
            price: 52999,
            originalPrice: 62999,
            image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=600",
            rating: 4.9,
            reviews: 98,
            isNew: false,
            isSale: true,
        },
        {
            id: 4,
            name: "Royal Pair",
            price: 72999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600",
            rating: 5.0,
            reviews: 145,
            isNew: true,
            isSale: false,
        },
        {
            id: 5,
            name: "Timeless Together",
            price: 41999,
            originalPrice: 48999,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=600",
            rating: 4.7,
            reviews: 189,
            isNew: false,
            isSale: true,
        },
        {
            id: 6,
            name: "Unity Gold",
            price: 59999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=600",
            rating: 4.8,
            reviews: 76,
            isNew: false,
            isSale: false,
        },
    ],
};

const categoryTitles = {
    men: "Men's Collection",
    women: "Women's Collection",
    couples: "Couples Collection",
};

const categoryDescriptions = {
    men: "Discover our curated selection of premium men's timepieces, crafted for the modern gentleman.",
    women: "Explore elegant women's watches that blend sophistication with contemporary style.",
    couples: "Celebrate your bond with our exclusive couples watch sets, perfectly paired for two.",
};

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
];

function WatchCard({ watch, index, category }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const productUrl = `/product/${category}/${watch.id}`;

    const handleCardClick = () => {
        router.push(productUrl);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Card Container */}
            <div className="bg-charcoal/50 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {watch.isNew && (
                            <span className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                New
                            </span>
                        )}
                        {watch.isSale && (
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Sale
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted
                            ? "bg-gold text-black"
                            : "bg-black/50 text-white hover:bg-gold hover:text-black"
                            }`}
                    >
                        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>

                    {/* Image */}
                    <Image
                        src={watch.image}
                        alt={watch.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay with Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 flex items-end justify-center pb-6"
                    >
                        <div className="flex gap-3">
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                                transition={{ delay: 0.1 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gold text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gold-light transition-colors"
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </motion.button>
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(productUrl);
                                }}
                                className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <Eye size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Details */}
                <div className="p-5">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(watch.rating) ? "text-gold" : "text-gray-600"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-gray-400 text-sm">({watch.reviews})</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-serif text-lg text-white mb-3 group-hover:text-gold transition-colors">
                        {watch.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <span className="text-gold font-semibold text-xl">
                            {formatPrice(watch.price)}
                        </span>
                        {watch.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">
                                {formatPrice(watch.originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function CollectionPage({ params }) {
    const resolvedParams = use(params);
    const category = resolvedParams.category;
    const [sortBy, setSortBy] = useState("featured");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [showOnlySale, setShowOnlySale] = useState(false);
    const [showOnlyNew, setShowOnlyNew] = useState(false);

    const watches = watchesData[category] || watchesData.men;
    const title = categoryTitles[category] || "Collection";
    const description = categoryDescriptions[category] || "";

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
        <main className="min-h-screen bg-background pt-15">
            {/* Hero Banner */}
            <section className="relative h-[40vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10" />
                <Image
                    src={
                        category === "women"
                            ? "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=1920"
                            : category === "couples"
                                ? "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920"
                                : "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1920"
                    }
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedWatches.map((watch, index) => (
                            <WatchCard key={watch.id} watch={watch} index={index} category={category} />
                        ))}
                    </div>

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
            <Footer />
        </main>
    );
}
