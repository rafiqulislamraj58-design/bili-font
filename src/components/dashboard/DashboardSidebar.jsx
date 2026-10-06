"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <aside className="hidden md:flex w-[240px] bg-slate-950 text-white p-4">
        <div className="w-full h-8 bg-slate-800 rounded animate-pulse" />
      </aside>
    );
  }

  const user = session?.user;
  const role = user?.role;

  const menus = {
    user: [
      {
        title: "Dashboard",
        href: "/dashboard/user",
        icon: "🏠",
      },
      {
        title: "Delivery History",
        href: "/dashboard/user/deliveries",
        icon: "📦",
      },
      {
        title: "Reading List",
        href: "/dashboard/user/reading-list",
        icon: "📚",
      },
      {
        title: "My Reviews",
        href: "/dashboard/user/reviews",
        icon: "⭐",
      },
      {
        title: "Profile",
        href: "/dashboard/user/profile",
        icon: "👤",
      },
    ],

    librarian: [
      {
        title: "Dashboard",
        href: "/dashboard/librarian",
        icon: "🏠",
      },
      {
        title: "Add Book",
        href: "/dashboard/librarian/add-book",
        icon: "➕",
      },
      {
        title: "Manage Inventory",
        href: "/dashboard/librarian/books",
        icon: "📚",
      },
      {
        title: "Manage Deliveries",
        href: "/dashboard/librarian/deliveries",
        icon: "🚚",
      },
      {
        title: "Earnings",
        href: "/dashboard/librarian/earnings",
        icon: "💰",
      },
      {
        title: "Profile",
        href: "/dashboard/librarian/profile",
        icon: "👤",
      },
    ],

    admin: [
      {
        title: "Dashboard",
        href: "/dashboard/admin",
        icon: "🏠",
      },
      {
        title: "Book Approval",
        href: "/dashboard/admin/books/approval",
        icon: "✅",
      },
      {
        title: "Manage Users",
        href: "/dashboard/admin/users",
        icon: "👥",
      },
      {
        title: "Manage Books",
        href: "/dashboard/admin/books",
        icon: "📚",
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: "💳",
      },
      {
        title: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: "📊",
      },
      {
        title: "Profile",
        href: "/dashboard/admin/profile",
        icon: "👤",
      },
    ],
  };

  const navItems = menus[role] || [];

  return (
    <aside className="hidden md:flex sticky top-[57px] h-[calc(100vh-57px)] w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white p-4">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Dashboard
        </p>

        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
          {role || "User"} Panel
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <span>🏠</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;