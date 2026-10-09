"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { adminFetch } from "@/lib/adminFetch";
import PageShell from "@/components/dashboard/PageShell";

const COLORS = ["#2563eb", "#9333ea", "#ea580c", "#059669", "#e11d48", "#0891b2"];

function ChartCard({ title, subtitle, loading, empty, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4 h-72">
        {loading ? (
          <div className="h-full animate-pulse rounded-xl bg-slate-100" />
        ) : empty ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No data yet.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function RankList({ title, subtitle, items, labelKey, loading }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>

      <ul className="mt-4 space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <li key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
          ))
        ) : items.length === 0 ? (
          <li className="py-6 text-center text-sm text-slate-500">No data yet.</li>
        ) : (
          items.map((item, i) => (
            <li
              key={item[labelKey]}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {i + 1}
                </span>
                <span className="truncate text-sm font-medium text-slate-800">
                  {item[labelKey]}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {item.count}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/analytics")
      .then((d) => setData(d.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const monthly = data?.monthlyRevenue || [];
  const hasRevenue = monthly.some((m) => m.revenue > 0);

  return (
    <PageShell
      title="Analytics"
      subtitle="Platform performance at a glance"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue trend */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue (Last 6 Months)"
            subtitle="Delivery fee payments received"
            loading={loading}
            empty={!hasRevenue}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `$${v}`} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Deliveries by status */}
        <ChartCard
          title="Deliveries by Status"
          subtitle="Pending, Dispatched and Delivered"
          loading={loading}
          empty={!data?.deliveriesByStatus?.length}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.deliveriesByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data?.deliveriesByStatus?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Books by status */}
        <ChartCard
          title="Books by Status"
          subtitle="Pending, published and unpublished listings"
          loading={loading}
          empty={!data?.booksByStatus?.length}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.booksByStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {data?.booksByStatus?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Users by role */}
        <ChartCard
          title="Users by Role"
          subtitle="Readers, librarians and admins"
          loading={loading}
          empty={!data?.usersByRole?.length}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.usersByRole}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                label
              >
                {data?.usersByRole?.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Orders per month */}
        <ChartCard
          title="Paid Orders per Month"
          subtitle="Number of successful payments"
          loading={loading}
          empty={!hasRevenue}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#9333ea" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <RankList
          title="Top Librarians"
          subtitle="Most completed deliveries"
          items={data?.topLibrarians || []}
          labelKey="email"
          loading={loading}
        />

        <RankList
          title="Most Requested Books"
          subtitle="Books with the most delivery requests"
          items={data?.topBooks || []}
          labelKey="title"
          loading={loading}
        />
      </div>
    </PageShell>
  );
}