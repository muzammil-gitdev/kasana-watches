"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        id: "mens",
        title: "Men's Collection",
        image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
        href: "/collection/men",
    },
    {
        id: "womens",
        title: "Women's Collection",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800",
        href: "/collection/women",
    },
    {
        id: "couples",
        title: "Couples Collection",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
        href: "/collection/couples",
    },
];

export default function CategorySection() {
    return (
        <section id="collection" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Curated Categories</h2>
                    <div className="w-24 h-1 bg-gold mx-auto" />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <Link href={cat.href} key={cat.id} className="group relative h-[500px] overflow-hidden block">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="h-full w-full"
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 duration-500" />
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                                    <h3 className="text-3xl font-serif text-white translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                        {cat.title}
                                    </h3>
                                    <span className="mt-4 text-gold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 font-medium">
                                        Explore
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
