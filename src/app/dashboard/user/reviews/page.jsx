"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import PageShell from "@/components/dashboard/PageShell";

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/user/reviews")
      .then((res) => setReviews(res.reviews || []))
      .catch((err) => toast.error(err.message || "Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminFetch(`/user/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <PageShell title="My Reviews" subtitle="Manage feedback and ratings you left for books">
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500">You haven't written any reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{rev.bookTitle}</h4>
                <div className="flex items-center gap-1 text-amber-500 my-1">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-600">{rev.comment}</p>
              </div>
              <button
                onClick={() => handleDelete(rev._id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}