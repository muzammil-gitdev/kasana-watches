"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-400 text-3xl">!</span>
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Something went wrong</h2>
                <p className="text-gray-400 mb-8">
                    {error?.message || "An unexpected error occurred while loading this page."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="bg-gold text-black px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="border border-white/20 text-white px-6 py-3 rounded-lg font-medium hover:border-gold hover:text-gold transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
