"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight, Trash2, Minus, Plus, Lock, Truck, Shield,
    CheckCircle2, Package, PartyPopper, Sparkles,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/utils";

/* ───────────── validation helpers ───────────── */
const validators = {
    firstName: (v) => (!v.trim() ? "First name is required" : ""),
    lastName: (v) => (!v.trim() ? "Last name is required" : ""),
    email: (v) => {
        if (!v.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email";
        return "";
    },
    phone: (v) => {
        if (!v.trim()) return "Phone number is required";
        if (!/^(\+92|0)?3\d{9}$/.test(v.replace(/[\s-]/g, "")))
            return "Enter a valid Pakistani phone number";
        return "";
    },
    address: (v) => (!v.trim() ? "Address is required" : v.trim().length < 10 ? "Enter a complete address" : ""),
    city: (v) => (!v.trim() ? "City is required" : ""),
    postalCode: (v) => (!v.trim() ? "Postal code is required" : ""),
};

const initialForm = {
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "", notes: "",
};

/* ───────────── order-confirmed animation ───────────── */
function OrderSuccessOverlay({ orderNumber, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
            {/* Confetti particles */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        x: 0, y: 0,
                        scale: 0,
                    }}
                    animate={{
                        opacity: [1, 1, 0],
                        x: (Math.random() - 0.5) * 600,
                        y: (Math.random() - 0.5) * 600,
                        scale: [0, 1, 0.5],
                        rotate: Math.random() * 720,
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        delay: 0.3 + Math.random() * 0.5,
                        ease: "easeOut",
                    }}
                    className="absolute pointer-events-none"
                    style={{
                        width: 8 + Math.random() * 10,
                        height: 8 + Math.random() * 10,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        background: ["#d4af37", "#f1d570", "#aa8c2c", "#fff", "#e8c547", "#c0a030"][
                            Math.floor(Math.random() * 6)
                        ],
                    }}
                />
            ))}

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                className="relative bg-[#111] border border-gold/30 rounded-2xl p-10 max-w-md w-full mx-6 text-center shadow-2xl shadow-gold/10"
            >
                {/* Animated check circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className="mx-auto mb-6 w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.7 }}
                        className="w-16 h-16 rounded-full bg-gold flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                        >
                            <CheckCircle2 size={36} className="text-black" strokeWidth={2.5} />
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <PartyPopper size={22} className="text-gold" />
                        <Sparkles size={18} className="text-gold-light" />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-2">Order Confirmed!</h2>
                    <p className="text-gray-400 mb-4">
                        Thank you for your purchase. Your luxury timepiece is on its way.
                    </p>
                    <div className="bg-white/5 rounded-lg px-4 py-3 mb-6 inline-block">
                        <p className="text-sm text-gray-400">Order Number</p>
                        <p className="text-gold font-mono font-bold text-lg">{orderNumber}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-col gap-3"
                >
                    <div className="flex items-center gap-3 text-sm text-gray-400 justify-center">
                        <Package size={16} className="text-gold" />
                        <span>A confirmation email has been sent</span>
                    </div>
                    <Link
                        href="/"
                        onClick={onClose}
                        className="mt-4 bg-gold text-black font-semibold py-3 px-8 rounded-lg hover:bg-gold-light transition-colors inline-block"
                    >
                        Continue Shopping
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

/* ───────────── main checkout ───────────── */
export default function CheckoutContent() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);

    const shipping = cartTotal >= 10000 ? 0 : 500;
    const total = cartTotal + shipping;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (touched[field] && validators[field]) {
            setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        if (validators[field]) {
            setErrors((prev) => ({ ...prev, [field]: validators[field](form[field]) }));
        }
    };

    const validateAll = () => {
        const newErrors = {};
        Object.keys(validators).forEach((field) => {
            const error = validators[field](form[field]);
            if (error) newErrors[field] = error;
        });
        setErrors(newErrors);
        setTouched(Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll() || cartItems.length === 0) return;

        setIsSubmitting(true);
        // Simulate processing
        await new Promise((r) => setTimeout(r, 2000));
        const num = "KW-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
        setOrderNumber(num);
        clearCart();
        setIsSubmitting(false);
    };

    /* ─── input helper ─── */
    const inputClasses = (field) =>
        `w-full bg-white/5 border ${
            errors[field] && touched[field]
                ? "border-red-500 focus:border-red-400"
                : "border-white/15 focus:border-gold"
        } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 ${
            errors[field] && touched[field] ? "focus:ring-red-400" : "focus:ring-gold/50"
        } transition-colors text-sm`;

    if (cartItems.length === 0 && !orderNumber) {
        return (
            <main className="min-h-screen bg-background pt-28 pb-16">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-serif text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-400 mb-8">Add some luxury timepieces before checking out.</p>
                        <Link href="/" className="bg-gold text-black font-semibold px-8 py-3 rounded-lg hover:bg-gold-light transition-colors">
                            Browse Collection
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <>
            <AnimatePresence>
                {orderNumber && (
                    <OrderSuccessOverlay
                        orderNumber={orderNumber}
                        onClose={() => setOrderNumber(null)}
                    />
                )}
            </AnimatePresence>

            <main className="min-h-screen bg-background pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-gold">Checkout</span>
                    </nav>
                </div>

                <div className="container mx-auto px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-serif text-white mb-10"
                    >
                        Checkout
                    </motion.h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-10">
                            {/* ───── LEFT: Order Details Form ───── */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="lg:col-span-2 space-y-8"
                            >
                                {/* Contact Info */}
                                <div className="bg-charcoal/30 rounded-xl p-6 border border-white/5">
                                    <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                        Contact Information
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {/* First Name */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">First Name <span className="text-red-400">*</span></label>
                                            <input
                                                id="firstName"
                                                type="text"
                                                value={form.firstName}
                                                onChange={(e) => handleChange("firstName", e.target.value)}
                                                onBlur={() => handleBlur("firstName")}
                                                className={inputClasses("firstName")}
                                                placeholder="Muhammad"
                                            />
                                            {errors.firstName && touched.firstName && (
                                                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                                            )}
                                        </div>
                                        {/* Last Name */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                                            <input
                                                id="lastName"
                                                type="text"
                                                value={form.lastName}
                                                onChange={(e) => handleChange("lastName", e.target.value)}
                                                onBlur={() => handleBlur("lastName")}
                                                className={inputClasses("lastName")}
                                                placeholder="Khan"
                                            />
                                            {errors.lastName && touched.lastName && (
                                                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                                            )}
                                        </div>
                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                onBlur={() => handleBlur("email")}
                                                className={inputClasses("email")}
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && touched.email && (
                                                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">Phone <span className="text-red-400">*</span></label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => handleChange("phone", e.target.value)}
                                                onBlur={() => handleBlur("phone")}
                                                className={inputClasses("phone")}
                                                placeholder="03XX XXXXXXX"
                                            />
                                            {errors.phone && touched.phone && (
                                                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-charcoal/30 rounded-xl p-6 border border-white/5">
                                    <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                        Shipping Address
                                    </h2>
                                    <div className="space-y-4">
                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">Street Address <span className="text-red-400">*</span></label>
                                            <input
                                                id="address"
                                                type="text"
                                                value={form.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                onBlur={() => handleBlur("address")}
                                                className={inputClasses("address")}
                                                placeholder="House #, Street, Area"
                                            />
                                            {errors.address && touched.address && (
                                                <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                                            )}
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {/* City */}
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1.5">City <span className="text-red-400">*</span></label>
                                                <input
                                                    id="city"
                                                    type="text"
                                                    value={form.city}
                                                    onChange={(e) => handleChange("city", e.target.value)}
                                                    onBlur={() => handleBlur("city")}
                                                    className={inputClasses("city")}
                                                    placeholder="Lahore"
                                                />
                                                {errors.city && touched.city && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                                                )}
                                            </div>
                                            {/* Postal Code */}
                                            <div>
                                                <label className="block text-sm text-gray-300 mb-1.5">Postal Code <span className="text-red-400">*</span></label>
                                                <input
                                                    id="postalCode"
                                                    type="text"
                                                    value={form.postalCode}
                                                    onChange={(e) => handleChange("postalCode", e.target.value)}
                                                    onBlur={() => handleBlur("postalCode")}
                                                    className={inputClasses("postalCode")}
                                                    placeholder="54000"
                                                />
                                                {errors.postalCode && touched.postalCode && (
                                                    <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm text-gray-300 mb-1.5">Order Notes (optional)</label>
                                            <textarea
                                                id="notes"
                                                value={form.notes}
                                                onChange={(e) => handleChange("notes", e.target.value)}
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors text-sm resize-none"
                                                placeholder="Any special instructions for delivery..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment - COD */}
                                <div className="bg-charcoal/30 rounded-xl p-6 border border-white/5">
                                    <h2 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                        Payment Method
                                    </h2>
                                    <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-gold flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">Cash on Delivery</p>
                                            <p className="text-gray-400 text-xs">Pay when your order arrives at your doorstep</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ───── RIGHT: Order Summary ───── */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="bg-charcoal/30 rounded-xl border border-white/5 sticky top-28">
                                    <div className="p-6 border-b border-white/10">
                                        <h2 className="text-xl font-serif text-white">Order Summary</h2>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={`${item.category}-${item.id}`} className="flex gap-3">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white text-sm truncate">{item.name}</h4>
                                                    <p className="text-gold text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id, item.category)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors self-start p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="p-6 border-t border-white/10 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-white">{formatPrice(cartTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Shipping</span>
                                            <span className={shipping === 0 ? "text-green-400 font-medium" : "text-white"}>
                                                {shipping === 0 ? "FREE" : formatPrice(shipping)}
                                            </span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                        <div className="flex justify-between">
                                            <span className="text-white font-medium">Total</span>
                                            <span className="text-gold font-bold text-xl">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="p-6 pt-0">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || cartItems.length === 0}
                                            className="w-full bg-gold text-black font-semibold py-3.5 rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            id="place-order-btn"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={18} />
                                                    Place Order — {formatPrice(total)}
                                                </>
                                            )}
                                        </button>

                                        {/* Trust */}
                                        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Lock size={12} /> Secure</span>
                                            <span className="flex items-center gap-1"><Truck size={12} /> Free Delivery 10k+</span>
                                            <span className="flex items-center gap-1"><Shield size={12} /> Warranty</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
