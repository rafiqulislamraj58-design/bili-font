"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  ChevronDown,
  Settings2,
  Home, 
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const DashboardNavbar = () => {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      setIsUserMenuOpen(false);
      router.push("/auth/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
          B
        </div>
        <h1 className="text-xl font-bold tracking-wide text-slate-800">
          bilidrop
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-600">
          <Bell className="h-5 w-5" />
        </button>

        {/* Loading State */}
        {isPending && (
          <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
        )}

        {/* Not Logged In */}
        {!isPending && !user && (
          <button
            onClick={() => router.push("/auth/signin")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Login
          </button>
        )}

        {/* Logged In */}
        {!isPending && user && (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 transition"
            >
              <div className="hidden md:block text-right">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                  {user.name || user.email}
                </p>
                <p className="text-xs capitalize text-slate-500">{role}</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>

              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {/* User Info */}
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium capitalize text-blue-600">
                    {role}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                 
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Home className="h-4 w-4 text-slate-500" />
                    Home
                  </button>

                  
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 p-1">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;