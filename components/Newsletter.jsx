"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle subscription
        setEmail("");
    };

    return (
        <section id="newsletter" className="py-24 bg-charcoal text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif mb-6"
                    >
                        Join the Inner Circle
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mb-10"
                    >
                        Subscribe to receive updates, access to exclusive deals, and more.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="relative flex items-center border-b border-white/20 pb-2 hover:border-gold transition-colors duration-300"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 py-2 px-2"
                            required
                        />
                        <button
                            type="submit"
                            className="text-gold hover:text-white transition-colors p-2"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
