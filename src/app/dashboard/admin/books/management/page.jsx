"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EyeOff, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import PageShell, {
  Badge,
  TableSkeleton,
} from "@/components/dashboard/PageShell";

const FILTERS = ["all", "pending", "published", "unpublished"];

export default function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    adminFetch("/books")
      .then((d) => setBooks(d.books))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const unpublish = async (id) => {
    try {
      await adminFetch(`/books/${id}/unpublish`, { method: "PATCH" });
      setBooks((p) =>
        p.map((b) => (b._id === id ? { ...b, status: "unpublished" } : b))
      );
      toast.success("Book unpublished");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this book permanently?")) return;
    try {
      await adminFetch(`/books/${id}`, { method: "DELETE" });
      setBooks((p) => p.filter((b) => b._id !== id));
      toast.success("Book deleted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const shown =
    filter === "all" ? books : books.filter((b) => b.status === filter);

  return (
    <PageShell
      title="Manage All Books"
      subtitle="Unpublish or delete any listing on the platform"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === f
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Book</th>
              <th className="p-4">Category</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Librarian</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={6} />
            ) : shown.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No books found.
                </td>
              </tr>
            ) : (
              shown.map((b) => (
                <tr key={b._id} className="border-t border-slate-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="h-14 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{b.title}</p>
                        <p className="text-xs text-slate-500">{b.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{b.category}</td>
                  <td className="p-4">${b.deliveryFee}</td>
                  <td className="p-4">{b.librarianEmail}</td>
                  <td className="p-4">
                    <Badge value={b.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {b.status === "published" && (
                        <button
                          onClick={() => unpublish(b._id)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600"
                        >
                          <EyeOff size={14} /> Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => remove(b._id)}
                        className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
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