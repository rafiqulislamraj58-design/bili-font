"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
RefreshCw,
AlertCircle,
PackageCheck,
Truck,
Wallet,
} from "lucide-react";

const API_URL = "https://backedn-bsaf.onrender.com";

async function getResponseData(response) {
const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
const responseText = await response.text();


throw new Error(
  responseText.includes("<!DOCTYPE") ||
    responseText.includes("<html")
    ? `API returned HTML instead of JSON. Status: ${response.status}. Check the API URL and endpoint.`
    : responseText || `Request failed with status ${response.status}`
);


}

const data = await response.json();

if (!response.ok) {
throw new Error(
data.message || `Request failed with status ${response.status}`
);
}

return data;
}

function formatCurrency(amount) {
return `৳ ${Number(amount || 0).toLocaleString("en-BD")}`;
}

function getStatusClass(status) {
switch (status) {
case "Delivered":
return "bg-green-100 text-green-700";
case "Dispatched":
return "bg-amber-100 text-amber-700";
default:
return "bg-blue-100 text-blue-700";
}
}

export default function EarningsPage() {
const { data: session, isPending } = useSession();

const [deliveries, setDeliveries] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState("");

const userEmail = session?.user?.email;

const fetchDeliveries = useCallback(
async (isRefresh = false) => {
if (!userEmail) {
setDeliveries([]);
setLoading(false);
setRefreshing(false);
return;
}


  if (isRefresh) {
    setRefreshing(true);
  } else {
    setLoading(true);
  }

  setError("");

  try {
    const response = await fetch(
      `${API_URL}/deliveries/librarian?email=${encodeURIComponent(userEmail)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await getResponseData(response);

    const deliveryList = Array.isArray(data)
      ? data
      : Array.isArray(data.deliveries)
        ? data.deliveries
        : [];

    setDeliveries(deliveryList);
  } catch (err) {
    console.error("Error fetching earnings data:", err);
    setError(err.message || "Could not load earnings data.");
    setDeliveries([]);
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

const deliveredItems = deliveries.filter(
(delivery) => delivery.status === "Delivered"
);

const totalEarnings = deliveredItems.reduce(
(total, delivery) => total + (Number(delivery.deliveryFee) || 0),
0
);

const totalDeliveries = deliveries.length;
const deliveredCount = deliveredItems.length;

if (isPending || loading) {
return ( <main className="flex min-h-[50vh] items-center justify-center"> <div className="flex items-center gap-3 text-gray-600"> <RefreshCw size={20} className="animate-spin" /> <p>Loading earnings data...</p> </div> </main>
);
}

if (!userEmail) {
return ( <main className="p-6"> <h2 className="text-lg font-bold text-gray-800">
Login required </h2> <p className="mt-2 text-sm text-gray-600">
Please sign in to view your earnings. </p> </main>
);
}

return ( <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"> <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> <div> <p className="mb-2 text-sm font-semibold text-blue-600">
Librarian Dashboard </p> <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
Earnings & Revenue </h1> <p className="mt-2 text-sm text-gray-500">
Review delivery fees and completed orders. </p> </div>


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
      Refresh Data
    </button>
  </div>

  {error && (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      <AlertCircle size={20} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Unable to load earnings</p>
        <p className="mt-1 break-words">{error}</p>
      </div>
      <button
        type="button"
        onClick={() => fetchDeliveries(true)}
        disabled={refreshing}
        className="shrink-0 font-semibold underline disabled:opacity-50"
      >
        Retry
      </button>
    </div>
  )}

  <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          Earnings from Delivered Orders
        </p>
        <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
          <Wallet size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">
        {formatCurrency(totalEarnings)}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Delivery fees for completed deliveries
      </p>
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          Total Requests
        </p>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Truck size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">
        {totalDeliveries}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        All assigned delivery requests
      </p>
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">
          Completed Deliveries
        </p>
        <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
          <PackageCheck size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">
        {deliveredCount}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Successfully delivered orders
      </p>
    </div>
  </section>

  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
      <h2 className="text-lg font-bold text-gray-900">
        Delivery Earnings
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        {deliveries.length}{" "}
        {deliveries.length === 1 ? "record" : "records"} found
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-4 font-semibold">#</th>
            <th className="px-5 py-4 font-semibold">Book Title</th>
            <th className="px-5 py-4 font-semibold">Client</th>
            <th className="px-5 py-4 font-semibold">Date</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Delivery Fee</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {deliveries.length > 0 ? (
            deliveries.map((delivery, index) => (
              <tr
                key={delivery._id || index}
                className="transition hover:bg-gray-50"
              >
                <td className="px-5 py-4 text-gray-500">
                  {index + 1}
                </td>
                <td className="px-5 py-4 font-medium text-gray-800">
                  {delivery.bookTitle || "Untitled Book"}
                </td>
                <td className="px-5 py-4 text-gray-700">
                  {delivery.clientName || "Unknown Client"}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {delivery.date
                    ? new Date(delivery.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      delivery.status
                    )}`}
                  >
                    {delivery.status || "Pending"}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-gray-800">
                  {formatCurrency(delivery.deliveryFee)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-16 text-center"
              >
                <PackageCheck
                  size={32}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p className="font-semibold text-gray-800">
                  No earning records found
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Delivery requests will appear here when available.
                </p>
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
