"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import PageShell, { TableSkeleton } from "@/components/dashboard/PageShell";

export default function BookApprovalPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/books?status=pending")
      .then((res) => setBooks(res.books || []))
      .catch((err) => toast.error(err.message || "Failed to load pending books"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminFetch(`/books/${id}/approve`, { method: "PATCH" });
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book approved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to approve book");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await adminFetch(`/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast.success("Book deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete book");
    }
  };

  return (
    <PageShell title="Book Approvals" subtitle="Review and approve books added by librarians">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Book Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Librarian Email</th>
              <th className="p-4">Delivery Fee</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={5} />
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No pending books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.image || "https://via.placeholder.com/40"}
                        alt={book.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{book.title}</p>
                        <p className="text-xs text-slate-500">By {book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{book.category}</td>
                  <td className="p-4 text-slate-600">{book.librarianEmail}</td>
                  <td className="p-4 text-slate-600">${book.deliveryFee}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleApprove(book._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size5={14} /> Reject
                    </button>
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