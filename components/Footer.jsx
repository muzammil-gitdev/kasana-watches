import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold tracking-widest text-white">KASANA</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Crafting timeless moments with precision and elegance. Experience the art of horology.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-gold uppercase tracking-widest text-sm font-semibold mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/collection/men" className="text-gray-400 hover:text-white transition-colors">Men's Watches</Link></li>
                            <li><Link href="/collection/women" className="text-gray-400 hover:text-white transition-colors">Women's Watches</Link></li>
                            <li><Link href="/collection/couples" className="text-gray-400 hover:text-white transition-colors">Couples Edition</Link></li>
                            <li><Link href="/accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-gold uppercase tracking-widest text-sm font-semibold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-gold uppercase tracking-widest text-sm font-semibold mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Kasana Watches. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-gray-500 hover:text-white text-sm">Terms of Service</Link>
                        <Link href="/privacy" className="text-gray-500 hover:text-white text-sm">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
