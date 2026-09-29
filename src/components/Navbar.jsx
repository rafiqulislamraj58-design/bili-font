
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  UserRound,
  LibraryBig,
  Settings2,
} from "lucide-react";

function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const [user, setUser] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const role = user?.role;

  const isActive = (href) => pathname === href;

  const isDashboardActive = pathname.startsWith("/dashboard");

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDashboardOpen(false);
  };

  // Role অনুযায়ী dashboard
  const dashboardConfig = {
    user: {
      href: "/dashboard/user",
      label: "User Dashboard",
      description: "Manage your account",
      icon: UserRound,
    },

    librarian: {
      href: "/dashboard/librarian",
      label: "Librarian Dashboard",
      description: "Manage books & library",
      icon: LibraryBig,
    },

    admin: {
      href: "/dashboard/admin",
      label: "Admin Dashboard",
      description: "Manage system settings",
      icon: Settings2,
    },
  };

  const dashboard = dashboardConfig[role];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-divider bg-background/80 backdrop-blur-xl">

      {/* ================= NAVBAR ================= */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-default-100 text-foreground transition hover:bg-default-200 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group text-xl font-bold tracking-tight"
          >
            <span className="text-foreground">Biblio</span>
            <span className="text-primary transition-opacity group-hover:opacity-80">
              Drop
            </span>
          </Link>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-1 md:flex">

          {/* Home */}
          <Link
            href="/"
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-default-100 hover:text-foreground"
            }`}
          >
            Home
          </Link>

          {/* Browse Books */}
          <Link
            href="/browse-books"
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              isActive("/browse-books")
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-default-100 hover:text-foreground"
            }`}
          >
            Browse Books
          </Link>

          {/* ================= DASHBOARD ================= */}
          {dashboard && (
            <div className="relative">

              <button
                type="button"
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isDashboardActive || isDashboardOpen
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-default-100 hover:text-foreground"
                }`}
              >
                Dashboard

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isDashboardOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dashboard Dropdown */}
              {isDashboardOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-divider bg-content1 p-2 shadow-2xl shadow-black/30">

                  {/* Header */}
                  <div className="px-3 pb-2 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      My Dashboard
                    </p>
                  </div>

                  {/* Current Role Dashboard */}
                  <Link
                    href={dashboard.href}
                    onClick={closeMenu}
                    className="group flex items-center gap-3 rounded-xl bg-default-100 px-3 py-3 transition hover:bg-primary/10"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <dashboard.icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {dashboard.label}
                      </p>

                      <p className="truncate text-xs text-foreground/45">
                        {dashboard.description}
                      </p>
                    </div>

                    <ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-foreground/30" />
                  </Link>

                </div>
              )}
            </div>
          )}

          {/* Login */}
          {!user && (
            <Link
              href="/login"
              className={`ml-3 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                isActive("/login")
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
              }`}
            >
              Login
            </Link>
          )}

          {/* Logged-in User */}
          {user && (
            <div className="ml-3 flex items-center gap-2 rounded-xl bg-default-100 px-3 py-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="hidden lg:block">
                <p className="max-w-28 truncate text-xs font-medium text-foreground">
                  {user.name || user.email}
                </p>

                <p className="text-[10px] capitalize text-foreground/40">
                  {role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE NAV ================= */}
      {isMenuOpen && (
        <div className="border-t border-divider bg-background md:hidden">

          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">

            {/* Home */}
            <Link
              href="/"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/75 hover:bg-default-100"
              }`}
            >
              Home
            </Link>

            {/* Browse */}
            <Link
              href="/browse-books"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive("/browse-books")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/75 hover:bg-default-100"
              }`}
            >
              Browse Books
            </Link>

            {/* ================= MOBILE DASHBOARD ================= */}
            {dashboard && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setIsDashboardOpen(!isDashboardOpen)
                  }
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    isDashboardActive || isDashboardOpen
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-default-100"
                  }`}
                >
                  <span>Dashboard</span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isDashboardOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDashboardOpen && (
                  <div className="ml-3 border-l-2 border-primary/20 pl-3">

                    <Link
                      href={dashboard.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-xl bg-default-100 px-3 py-3 transition hover:bg-primary/10"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <dashboard.icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {dashboard.label}
                        </p>

                        <p className="text-xs text-foreground/45">
                          {dashboard.description}
                        </p>
                      </div>
                    </Link>

                  </div>
                )}
              </>
            )}

            {/* Mobile Login */}
            {!user && (
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                Login
              </Link>
            )}

            {/* Mobile User Info */}
            {user && (
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-default-100 px-4 py-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {user.name || user.email}
                  </p>

                  <p className="text-xs capitalize text-foreground/45">
                    {role}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
