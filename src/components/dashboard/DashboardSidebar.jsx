"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Truck,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  Library,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard/librarian",
    icon: LayoutDashboard,
  },
  {
    label: "My Books",
    href: "/dashboard/librarian/books",
    icon: BookOpen,
  },
  {
    label: "Add Book",
    href: "/dashboard/libariyan/books/add",
    icon: PlusCircle,
  },
  {
    label: "Delivery Requests",
    href: "/dashboard/librarian/deliveries",
    icon: Truck,
  },
  {
    label: "Reviews",
    href: "/dashboard/librarian/reviews",
    icon: MessageSquare,
  },
];

const accountItems = [
  {
    label: "Profile",
    href: "/dashboard/librarian/profile",
    icon: UserCircle,
  },
  {
    label: "Settings",
    href: "/dashboard/librarian/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard/librarian") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-[#e5e8e2] bg-[#ffffff]
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#edf0eb] px-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#243b2b] text-white">
              <Library size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#17211b]">
                BiblioDrop
              </h1>

              <p className="text-[11px] text-[#7b817c]">
                Librarian Panel
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-[#687269] hover:bg-[#f3f5f2] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          {/* Main */}
          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9aa19b]">
              Main Menu
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center gap-3 rounded-xl px-3 py-3
                      text-sm font-medium transition-all
                      ${
                        active
                          ? "bg-[#eaf1e9] text-[#294d32]"
                          : "text-[#626b64] hover:bg-[#f5f7f4] hover:text-[#243b2b]"
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      className={
                        active
                          ? "text-[#355b3e]"
                          : "text-[#89918a] group-hover:text-[#355b3e]"
                      }
                    />

                    <span>{item.label}</span>

                    {item.label === "Delivery Requests" && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#355b3e] px-1.5 text-[10px] font-semibold text-white">
                        8
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9aa19b]">
              Account
            </p>

            <div className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center gap-3 rounded-xl px-3 py-3
                      text-sm font-medium transition-all
                      ${
                        active
                          ? "bg-[#eaf1e9] text-[#294d32]"
                          : "text-[#626b64] hover:bg-[#f5f7f4] hover:text-[#243b2b]"
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      className={
                        active
                          ? "text-[#355b3e]"
                          : "text-[#89918a] group-hover:text-[#355b3e]"
                      }
                    />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-[#edf0eb] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#f7f9f6] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dce8dc] font-semibold text-[#355b3e]">
              R
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#202721]">
                Rojony
              </p>

              <p className="truncate text-xs text-[#858c86]">
                Librarian
              </p>
            </div>

            <button
              title="Logout"
              className="rounded-lg p-2 text-[#89918a] transition hover:bg-white hover:text-red-500"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}