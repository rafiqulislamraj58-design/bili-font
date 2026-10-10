
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
  RefreshCw,
  Truck,
  PackageCheck,
  Clock,
  AlertCircle,
  CalendarDays,
  UserRound,
  BookOpen,
} from "lucide-react";

const API_URL = "https://backedn-bsaf.onrender.com";

const getResponseData = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let data;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("The server returned invalid JSON.");
    }
  } else {
    throw new Error(
      text.includes("<!DOCTYPE") || text.includes("<html")
        ? `API returned HTML instead of JSON (${res.status}). Check the endpoint URL.`
        : text || `Request failed (${res.status})`
    );
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700 ring-green-200";
    case "Dispatched":
      return "bg-amber-100 text-amber-700 ring-amber-200";
    default:
      return "bg-blue-100 text-blue-700 ring-blue-200";
  }
};

export default function ManageDeliveriesPage() {
  const { data: session, isPending } = useSession();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const userEmail = session?.user?.email;

  const fetchDeliveries = useCallback(
    async (isRefresh = false) => {
      if (!userEmail) {
        setDeliveries([]);
        setLoading(false);
        return;
      }


      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await fetch(
          `${API_URL}/deliveries/librarian?email=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await getResponseData(res);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.deliveries)
            ? data.deliveries
            : Array.isArray(data.data)
              ? data.data
              : [];

        setDeliveries(list);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
        setError(err.message || "Could not load delivery requests.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userEmail]
  );

  useEffect(() => {
    if (!isPending) {
      fetchDeliveries();
    }
  }, [isPending, fetchDeliveries]);

  const handleStatusChange = async (id, newStatus) => {
    if (!id) {
      setError("Delivery ID is missing.");
      return;
    }

    const previousDeliveries = deliveries;

    setUpdatingId(id);
    setError("");

    setDeliveries((current) =>
      current.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res = await fetch(`${API_URL}/deliveries/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      await getResponseData(res);
      await fetchDeliveries(true);
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setDeliveries(previousDeliveries);
      setError(err.message || "Failed to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = deliveries.filter(
    (item) => (item.status || "Pending") === "Pending"
  ).length;

  const dispatchedCount = deliveries.filter(
    (item) => item.status === "Dispatched"
  ).length;

  const deliveredCount = deliveries.filter(
    (item) => item.status === "Delivered"
  ).length;

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-sm text-gray-500">
          Loading delivery requests...
        </p>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-600" />
        <h2 className="text-lg font-bold text-gray-800">
          Login required
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please sign in to view your delivery requests.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Truck size={18} />
            <span>Librarian Dashboard</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manage Deliveries
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track requests and update the delivery status of your books.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDeliveries(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 shrink-0" size={20} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 break-words">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => fetchDeliveries(true)}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Requests
            </p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Truck size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {deliveries.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            All delivery requests
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Awaiting dispatch
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Dispatched
            </p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Truck size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {dispatchedCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Currently on the way
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Delivered</p>
            <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
              <PackageCheck size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">
            {deliveredCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Successfully completed
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900">
            Delivery Requests
          </h2>
          <p className="text-sm text-gray-500">
            {deliveries.length}{" "}
            {deliveries.length === 1 ? "request" : "requests"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Client</th>
                <th className="px-5 py-4 font-semibold">Book</th>
                <th className="px-5 py-4 font-semibold">Request Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Update Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {deliveries.length > 0 ? (
                deliveries.map((delivery, index) => {
                  const id = delivery._id || delivery.id;
                  const status = delivery.status || "Pending";

                  return (
                    <tr
                      key={id || index}
                      className="transition hover:bg-gray-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            <UserRound size={18} />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {delivery.clientName ||
                              delivery.customerName ||
                              delivery.customerEmail ||
                              "Unknown Client"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <BookOpen
                            size={17}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            {delivery.bookTitle ||
                              delivery.book?.title ||
                              "Untitled Book"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          {delivery.date || delivery.createdAt
                            ? new Date(
                                delivery.date || delivery.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Update status for ${delivery.bookTitle || "delivery"}`}
                            className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(id, e.target.value)
                            }
                            disabled={!id || updatingId === id}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>

                          {updatingId === id && (
                            <span className="loading loading-spinner loading-sm text-primary" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 rounded-2xl bg-gray-100 p-4 text-gray-400">
                        <PackageCheck size={32} />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        No delivery requests found
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Delivery requests associated with your inventory will appear here.
                      </p>
                      <button
                        type="button"
                        onClick={() => fetchDeliveries(true)}
                        className="mt-4 text-sm font-semibold text-primary hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

