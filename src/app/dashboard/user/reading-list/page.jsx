"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminFetch } from "@/lib/adminFetch";
import PageShell from "@/components/dashboard/PageShell";

export default function UserReadingListPage() {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/user/reading-list")
      .then((res) => setReadingList(res.readingList || []))
      .catch((err) => toast.error(err.message || "Failed to load reading list"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="My Reading List" subtitle="Gallery of books successfully delivered to you">
      {loading ? (
        <p className="text-slate-500">Loading reading list...</p>
      ) : readingList.length === 0 ? (
        <p className="text-slate-500">No books found in your reading list.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {readingList.map((book) => (
            <div key={book._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
              <img src={book.image} alt={book.title} className="h-48 w-full rounded-xl object-cover mb-3" />
              <h4 className="font-semibold text-slate-900 truncate">{book.title}</h4>
              <p className="text-xs text-slate-500 mb-2">By {book.author}</p>
              <span className="mt-auto text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                Delivered
              </span>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}