"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  BookOpen,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  Truck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const API_URL = "https://backedn-bsaf.onrender.com"

export default function LibrarianOverviewPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [books, setBooks] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (sessionLoading) return;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const email = encodeURIComponent(userEmail);

        const [booksResponse, deliveriesResponse] = await Promise.all([
          fetch(`${API_URL}/books/librarian?email=${email}`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/deliveries/librarian?email=${email}`, {
            cache: "no-store",
          }),
        ]);

        let booksData = [];
        let deliveriesData = [];

        if (booksResponse.ok) {
          const data = await booksResponse.json();

          if (Array.isArray(data)) {
            booksData = data;
          } else if (Array.isArray(data.books)) {
            booksData = data.books;
          }
        } else {
          console.error(
            "Books API error:",
            booksResponse.status,
            booksResponse.statusText
          );
        }

        if (deliveriesResponse.ok) {
          const data = await deliveriesResponse.json();

          if (Array.isArray(data)) {
            deliveriesData = data;
          } else if (Array.isArray(data.deliveries)) {
            deliveriesData = data.deliveries;
          }
        } else {
          console.error(
            "Delivery API error:",
            deliveriesResponse.status,
            deliveriesResponse.statusText
          );
        }

        setBooks(booksData);
        setDeliveries(deliveriesData);

        if (!booksResponse.ok && !deliveriesResponse.ok) {
          setError("Unable to load dashboard data.");
        }
      } catch (error) {
        console.error("Librarian dashboard error:", error);
        setError("Something went wrong while loading dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [sessionLoading, userEmail]);

  const stats = useMemo(() => {
    const totalBooks = books.length;

    const totalEarnings = deliveries
      .filter(
        (item) => item?.status?.toLowerCase() === "delivered"
      )
      .reduce(
        (total, item) => total + (Number(item?.deliveryFee) || 0),
        0
      );

    const pendingRequests = deliveries.filter(
      (item) => item?.status?.toLowerCase() === "pending"
    ).length;

    const completedDeliveries = deliveries.filter(
      (item) => item?.status?.toLowerCase() === "delivered"
    ).length;

    const dispatchedDeliveries = deliveries.filter(
      (item) => item?.status?.toLowerCase() === "dispatched"
    ).length;

    return {
      totalBooks,
      totalEarnings,
      pendingRequests,
      completedDeliveries,
      dispatchedDeliveries,
    };
  }, [books, deliveries]);

  const recentDeliveries = useMemo(() => {
    return [...deliveries]
      .sort(
        (a, b) =>
          new Date(b?.createdAt || b?.requestDate || 0) -
          new Date(a?.createdAt || a?.requestDate || 0)
      )
      .slice(0, 5);
  }, [deliveries]);

  const completionPercentage = deliveries.length
    ? Math.round(
        (stats.completedDeliveries / deliveries.length) * 100
      )
    : 0;

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm text-gray-500">
            Loading librarian dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />

          <h2 className="text-xl font-bold text-gray-800">
            Session not found
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Please login again to access your librarian dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Librarian Dashboard
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-800 sm:text-3xl">
            Welcome back, {session?.user?.name || "Librarian"}! 👋
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
            Manage your books, monitor delivery requests, and track
            your earnings from one place.
          </p>
        </div>

        <Link
          href="/dashboard/librarian/add-book"
          className="btn btn-primary gap-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </Link>
      </div>

      {error && (
        <div className="alert border border-warning/20 bg-warning/10 text-warning">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Books Listed"
          value={stats.totalBooks}
          description="Your book inventory"
          icon={BookOpen}
          iconClass="text-primary"
          bgClass="bg-primary/10"
        />

        <StatCard
          title="Total Earnings"
          value={`৳ ${stats.totalEarnings}`}
          description="From completed deliveries"
          icon={DollarSign}
          iconClass="text-success"
          bgClass="bg-success/10"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          description="Waiting for dispatch"
          icon={Clock}
          iconClass="text-warning"
          bgClass="bg-warning/10"
        />

        <StatCard
          title="Completed Deliveries"
          value={stats.completedDeliveries}
          description="Successfully delivered"
          icon={CheckCircle2}
          iconClass="text-info"
          bgClass="bg-info/10"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Delivery Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current delivery request status
              </p>
            </div>

            <Truck className="h-6 w-6 text-primary" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <OverviewItem
              label="Pending"
              value={stats.pendingRequests}
              description="Need attention"
            />

            <OverviewItem
              label="Dispatched"
              value={stats.dispatchedDeliveries}
              description="On the way"
            />

            <OverviewItem
              label="Delivered"
              value={stats.completedDeliveries}
              description="Completed"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Delivery completion
              </span>

              <span className="font-semibold text-gray-800">
                {completionPercentage}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your library
              </p>
            </div>

            <TrendingUp className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-3">
            <QuickAction
              href="/dashboard/librarian/add-book"
              icon={Plus}
              title="Add New Book"
              description="Add a book to inventory"
            />

            <QuickAction
              href="/dashboard/librarian/books"
              icon={BookOpen}
              title="Manage Inventory"
              description="View and manage books"
            />

            <QuickAction
              href="/dashboard/librarian/earnings"
              icon={DollarSign}
              title="View Earnings"
              description="Check your revenue"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Recent Delivery Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest requests for your books
            </p>
          </div>

          <Link
            href="/dashboard/librarian/deliveries"
            className="btn btn-ghost btn-sm gap-1 text-primary"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentDeliveries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
            <Truck className="mx-auto mb-3 h-10 w-10 text-gray-300" />

            <h3 className="font-semibold text-gray-700">
              No delivery requests yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Delivery requests will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Customer</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentDeliveries.map((delivery, index) => (
                  <tr key={delivery?._id || delivery?.id || index}>
                    <td>
                      <div className="font-semibold text-gray-800">
                        {delivery?.bookTitle ||
                          delivery?.title ||
                          delivery?.book?.title ||
                          "Book"}
                      </div>
                    </td>

                    <td>
                      {delivery?.customerName ||
                        delivery?.customerEmail ||
                        delivery?.email ||
                        "Customer"}
                    </td>

                    <td>
                      ৳ {Number(delivery?.deliveryFee) || 0}
                    </td>

                    <td>
                      <StatusBadge status={delivery?.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  bgClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-gray-800">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${bgClass} ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function OverviewItem({ label, value, description }) {
  return (
    <div className="rounded-xl bg-gray-50 p-5">
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-gray-800">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-primary/30 hover:bg-primary/5"
    >
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "delivered") {
    return (
      <span className="badge badge-success badge-sm">
        Delivered
      </span>
    );
  }

  if (normalizedStatus === "dispatched") {
    return (
      <span className="badge badge-info badge-sm">
        Dispatched
      </span>
    );
  }

  return (
    <span className="badge badge-warning badge-sm">
      Pending
    </span>
  );
}