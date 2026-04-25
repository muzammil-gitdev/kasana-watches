"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CartNotification from "@/components/CartNotification";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <CartSidebar />
      <CartNotification />
      {children}
      <Footer />
    </>
  );
}
