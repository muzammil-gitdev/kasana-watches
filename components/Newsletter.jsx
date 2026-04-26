"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const [status, setStatus] = useState("idle"); // idle, loading, success, error, duplicate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        
        try {
            const emailRef = doc(db, "subscribed_users_email", email.toLowerCase().trim());
            const docSnap = await getDoc(emailRef);

            if (docSnap.exists()) {
                setStatus("duplicate");
                setTimeout(() => setStatus("idle"), 3000);
                return;
            }

            await setDoc(emailRef, {
                email: email.toLowerCase().trim(),
                subscribedAt: serverTimestamp(),
            });

            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            console.error("Subscription error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
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
                            disabled={status === "loading"}
                            className="text-gold hover:text-white transition-colors p-2"
                        >
                            <ArrowRight size={24} className={status === "loading" ? "animate-pulse" : ""} />
                        </button>
                    </motion.form>
                    
                    {status === "success" && (
                        <p className="text-emerald-400 mt-4 text-sm">Welcome to the Inner Circle!</p>
                    )}
                    {status === "duplicate" && (
                        <p className="text-gold mt-4 text-sm">You are already subscribed.</p>
                    )}
                    {status === "error" && (
                        <p className="text-red-400 mt-4 text-sm">Something went wrong. Please try again.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
