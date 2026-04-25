"use client";

import { usePathname } from "next/navigation";
import PortalSidebar from "@/components/portal/PortalSidebar";
import PortalHeader from "@/components/portal/PortalHeader";

export default function PortalLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/portal/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#060606]">
      <PortalSidebar />
      <div className="flex-1 flex flex-col ml-0 lg:ml-72">
        <PortalHeader />
        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
