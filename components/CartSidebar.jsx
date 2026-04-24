"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
    const {
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const sidebarRef = useRef(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        if (isCartOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isCartOpen, setIsCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-[#111111] border-l border-white/10 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={22} className="text-gold" />
                                <h2 className="text-xl font-serif text-white">
                                    Your Cart
                                </h2>
                                <span className="bg-gold/20 text-gold text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                id="close-cart-btn"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <ShoppingBag
                                            size={64}
                                            className="text-white/10 mb-6"
                                        />
                                    </motion.div>
                                    <p className="text-gray-400 text-lg mb-2">
                                        Your cart is empty
                                    </p>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Explore our collections and find your perfect timepiece
                                    </p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-gold text-black font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {cartItems.map((item) => (
                                            <motion.div
                                                key={`${item.category}-${item.id}`}
                                                layout
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: 50,
                                                    scale: 0.9,
                                                    transition: { duration: 0.2 },
                                                }}
                                                className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/5 hover:border-gold/20 transition-colors"
                                            >
                                                {/* Image */}
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-medium text-sm truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-gold font-semibold text-sm mt-1">
                                                        {formatPrice(item.price)}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-0 border border-white/15 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.category,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                                disabled={item.quantity <= 1}
                                                                className="px-2 py-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="px-3 py-1 text-white text-sm font-medium min-w-[32px] text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.category,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                                className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(item.id, item.category)
                                                            }
                                                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-white/10 p-6 space-y-4">
                                {/* Subtotal */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="text-green-400 text-xs font-medium">
                                            {cartTotal >= 10000 ? "FREE" : formatPrice(500)}
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">Total</span>
                                        <span className="text-gold font-bold text-lg">
                                            {formatPrice(
                                                cartTotal + (cartTotal >= 10000 ? 0 : 500)
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-gold text-black font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-all hover:gap-3 group"
                                    id="checkout-btn"
                                >
                                    Proceed to Checkout
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                {/* Continue Shopping */}
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full text-gray-400 text-sm hover:text-white transition-colors py-2"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
