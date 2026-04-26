"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    Star,
    Minus,
    Plus,
    ChevronRight,
    Check,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { categoryTitles } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

export default function ProductDetailContent({ category, id }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-white mb-4">Product Not Found</h1>
                    <Link href={`/collection/${category}`} className="text-gold hover:text-gold-light">
                        ← Back to Collection
                    </Link>
                </div>
            </main>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-background pt-20">
            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-6">
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href={`/collection/${category}`} className="hover:text-gold transition-colors">
                        {categoryTitles[category]}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-gold">{product.name}</span>
                </nav>
            </div>

            {/* Product Section */}
            <section className="container mx-auto px-6 pb-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-charcoal/30 mb-4">
                            {product.isNew && (
                                <span className="absolute top-4 left-4 z-10 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    New
                                </span>
                            )}
                            {product.isSale && (
                                <span className="absolute top-4 left-20 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    -{discount}%
                                </span>
                            )}
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                            ? "border-gold"
                                            : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - View ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-600"}
                                    />
                                ))}
                            </div>
                            <span className="text-gold font-medium">{product.rating}</span>
                            <span className="text-gray-400">({product.reviews} reviews)</span>
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-gold">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                    <span className="bg-red-500/20 text-red-400 text-sm font-medium px-3 py-1 rounded-full">
                                        Save {discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-8 leading-relaxed">{product.description}</p>

                        {/* Features Quick View */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {product.features.slice(0, 4).map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                    <Check size={16} className="text-gold" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-white/20 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-white hover:text-gold transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="px-6 py-3 text-white font-medium min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-white hover:text-gold transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={() => addToCart({
                                    id: product.id,
                                    category,
                                    name: product.name,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    image: product.images[0],
                                }, quantity)}
                                className="flex-1 bg-gold text-black font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`px-4 py-3 rounded-lg border transition-all ${isWishlisted
                                    ? "bg-gold border-gold text-black"
                                    : "border-white/20 text-white hover:border-gold hover:text-gold"
                                    }`}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            {/* Share */}
                            <button className="px-4 py-3 rounded-lg border border-white/20 text-white hover:border-gold hover:text-gold transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-6 bg-charcoal/30 rounded-xl border border-white/5">
                            <div className="flex flex-col items-center text-center">
                                <Truck size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Free Delivery</span>
                                <span className="text-xs text-gray-400">On orders over Rs 10,000</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Shield size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Warranty</span>
                                <span className="text-xs text-gray-400">{product.specs.warranty}</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RotateCcw size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Easy Returns</span>
                                <span className="text-xs text-gray-400">30-day return policy</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    {/* Tab Headers */}
                    <div className="flex border-b border-white/10 mb-8">
                        {["description", "specifications", "reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm uppercase tracking-wider font-medium transition-colors relative ${activeTab === tab
                                    ? "text-gold"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-charcoal/20 rounded-xl p-8 border border-white/5"
                    >
                        {activeTab === "description" && (
                            <div>
                                <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>
                                <h4 className="text-white font-serif text-xl mb-4">Key Features</h4>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-300">
                                            <Check size={18} className="text-gold flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-3 border-b border-white/10">
                                        <span className="text-gray-400 capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-white font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="text-center py-12">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={32}
                                            className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-600"}
                                        />
                                    ))}
                                </div>
                                <p className="text-3xl font-serif text-white mb-2">{product.rating} out of 5</p>
                                <p className="text-gray-400 mb-8">Based on {product.reviews} reviews</p>
                                <button className="bg-gold text-black font-semibold py-3 px-8 rounded-lg hover:bg-gold-light transition-colors">
                                    Write a Review
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
