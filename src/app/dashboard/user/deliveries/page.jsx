"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminFetch } from "@/lib/adminFetch";
import PageShell, { Badge } from "@/components/dashboard/PageShell";

export default function UserDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/user/deliveries")
      .then((res) => setDeliveries(res.deliveries || []))
      .catch((err) => toast.error(err.message || "Failed to load deliveries"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Delivery History" subtitle="Track all your book delivery requests and statuses">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Book Title</th>
              <th className="p-4">Delivery Fee</th>
              <th className="p-4">Request Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Loading deliveries...</td>
              </tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No delivery history found.</td>
              </tr>
            ) : (
              deliveries.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-slate-900">{item.bookTitle}</td>
                  <td className="p-4 text-slate-600">${item.deliveryFee}</td>
                  <td className="p-4 text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Badge value={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}