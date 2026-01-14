"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2400",
        title: "Timeless Precision",
        subtitle: "Crafted for those who value every second.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=2400",
        title: "Modern Elegance",
        subtitle: "Sophistication that speaks for itself.",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=2400",
        title: "The Golden Era",
        subtitle: "A tribute to classic horology.",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover object-center"
                        priority
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-gold tracking-[0.2em] font-medium uppercase mb-4"
                        >
                            Exquisite Collection
                        </motion.p>
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6"
                        >
                            {slides[current].title}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl font-light"
                        >
                            {slides[current].subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                        >
                            <Button size="lg" variant="primary">
                                Shop Collection
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors hidden md:block"
            >
                <ChevronLeft size={48} strokeWidth={1} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition-colors hidden md:block"
            >
                <ChevronRight size={48} strokeWidth={1} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-gold scale-125" : "bg-white/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
