"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  ExternalLink,
  LogOut,
  X,
  Menu,
  Watch,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/portal",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/portal/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/portal/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kasana_admin");
    router.push("/portal/login");
  };

  const isActive = (href) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-white/5">
        <Link href="/portal" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <Watch size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-white tracking-wider">
              KASANA
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-3 mb-3">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                active
                  ? "text-gold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gold/10 border border-gold/20 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium px-3 mb-3">
            Quick Actions
          </p>
          <Link
            href="/portal/products?action=add"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-gold hover:bg-white/5 transition-all"
        >
          <ExternalLink size={16} />
          <span>View Storefront</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-5 left-4 z-50 w-10 h-10 bg-charcoal border border-white/10 rounded-xl flex items-center justify-center text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/5 z-[60]"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/5 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}
