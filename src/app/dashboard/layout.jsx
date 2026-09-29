"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f8f5]">

      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="min-w-0 flex-1">

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#e5e8e2] bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-[#354038] hover:bg-[#f3f5f2]"
          >
            <Menu size={23} />
          </button>

          <span className="ml-3 text-base font-semibold text-[#17211b]">
            Librarian Dashboard
          </span>
        </header>

        {/* Page */}
        <main>{children}</main>
      </div>
    </div>
  );
}