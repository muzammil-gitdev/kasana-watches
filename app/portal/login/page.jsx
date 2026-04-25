"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Watch, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1200));

    // Demo credentials
    if (email === "admin@kasana.com" && password === "admin123") {
      localStorage.setItem("kasana_admin", "true");
      router.push("/portal");
    } else {
      setError("Invalid credentials. Try admin@kasana.com / admin123");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/3 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                bounce: 0.4,
                delay: 0.2,
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-5 shadow-lg shadow-gold/20"
            >
              <Watch size={28} className="text-black" />
            </motion.div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wider">
              KASANA
            </h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold/60 mt-1">
              Admin Portal
            </p>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to manage your store
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  placeholder="admin@kasana.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-[11px] text-gold/70 text-center leading-relaxed">
              <span className="font-semibold text-gold/90">Demo:</span>{" "}
              admin@kasana.com / admin123
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} Kasana Watches. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
