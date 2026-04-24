"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CartNotification() {
    const { cartNotification } = useCart();

    return (
        <AnimatePresence>
            {cartNotification && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="fixed top-24 left-1/2 z-[90] bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-green-500/20"
                >
                    <Check size={18} />
                    <span className="font-medium text-sm">{cartNotification} added to cart!</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
