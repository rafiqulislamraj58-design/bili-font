"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, BookOpen, Truck, DollarSign, Clock } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import PageShell from "@/components/dashboard/PageShell";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.message || "Failed to fetch admin stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell title="Admin Dashboard" subtitle="Overview of platform statistics and metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100 border border-slate-200"></div>
          ))}
        </div>
      </PageShell>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Total Books",
      value: stats?.totalBooks || 0,
      icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Total Deliveries",
      value: stats?.totalDeliveries || 0,
      icon: <Truck className="h-6 w-6 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: <DollarSign className="h-6 w-6 text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
    },
  ];

  return (
    <PageShell title="Admin Dashboard" subtitle="Monitor platform performance, users, and financial records">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className={`rounded-2xl border p-6 shadow-sm bg-white flex items-center justify-between`}>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
            <div className={`rounded-xl p-3 ${card.bg}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approval Notice / Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Pending Approvals</h3>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-sm font-medium text-slate-600">Books waiting for admin approval</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {stats?.pendingBooks || 0} Books
            </span>
          </div>
        </div>

        {/* Books by Category Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Books by Category</h3>
          <div className="space-y-3">
            {stats?.byCategory?.length === 0 ? (
              <p className="text-sm text-slate-500">No categories found.</p>
            ) : (
              stats?.byCategory?.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">{cat.name}</span>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${Math.min(
                            (cat.value / (stats?.totalBooks || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right">
                      {cat.value}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}