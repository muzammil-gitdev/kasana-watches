"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";

export default function WatchCard({ watch, index, category }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();
    const { addToCart } = useCart();

    const productUrl = `/product/${category}/${watch.id}`;

    const handleCardClick = () => {
        router.push(productUrl);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({
            id: watch.id,
            category,
            name: watch.name,
            price: watch.price,
            originalPrice: watch.originalPrice,
            image: watch.image,
        });
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
                                onClick={handleAddToCart}
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
