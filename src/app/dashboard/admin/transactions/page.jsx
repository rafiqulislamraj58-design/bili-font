"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminFetch } from "@/lib/adminFetch";
import PageShell, { TableSkeleton } from "@/components/dashboard/PageShell";

export default function TransactionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/transactions")
      .then((d) => setItems(d.transactions))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = items.reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <PageShell
      title="All Transactions"
      subtitle="Every successful delivery fee payment"
    >
      <div className="mb-4 inline-block rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3">
        <p className="text-xs text-emerald-700">Total Revenue</p>
        <p className="text-2xl font-bold text-emerald-800">
          ${total.toLocaleString("en-US")}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">User Email</th>
              <th className="p-4">Librarian Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={5} />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              items.map((t) => (
                <tr key={t.transactionId} className="border-t border-slate-100">
                  <td className="max-w-[180px] truncate p-4 font-mono text-xs">
                    {t.transactionId}
                  </td>
                  <td className="p-4">{t.userEmail}</td>
                  <td className="p-4">{t.librarianEmail}</td>
                  <td className="p-4 font-semibold text-emerald-700">
                    ${t.amount}
                  </td>
                  <td className="p-4">
                    {new Date(t.date).toLocaleDateString()}
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