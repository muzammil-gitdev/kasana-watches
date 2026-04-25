"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles = {
  "/portal": "Dashboard",
  "/portal/products": "Products",
  "/portal/orders": "Orders",
};

export default function PortalHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Portal";

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[#060606]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
      <div className="flex items-center justify-between pl-12">
        <h2 className="text-lg font-serif font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-[#060606]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black text-sm font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
