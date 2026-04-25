"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import SearchOverlay from "@/components/SearchOverlay";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#collection", label: "Watches" },
    { href: "/#newsletter", label: "Newsletter" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5",
                    isScrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-white">
                        KASANA
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm uppercase tracking-widest text-gray-300 hover:text-gold transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-6 text-white">
                        <button onClick={() => setIsSearchOpen(true)} className="hover:text-gold transition-colors">
                            <Search size={20} />
                        </button>
                        <Link href="/portal/login" className="hover:text-gold transition-colors">
                            <User size={20} />
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="hover:text-gold transition-colors relative"
                            id="cart-icon-btn"
                        >
                            <ShoppingBag size={20} />
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.5 }}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-black text-[10px] font-bold flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
                    >
                        <button
                            className="absolute top-8 right-8 text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col gap-8 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-2xl font-serif text-white hover:text-gold transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
