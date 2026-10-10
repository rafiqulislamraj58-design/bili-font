"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import PageShell from "@/components/dashboard/PageShell";

export default function LibrarianProfilePage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Librarian profile update API call ekhane add korben
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Librarian Profile" subtitle="Manage your library provider profile information">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Librarian")}`}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border"
            />
            <div>
              <h3 className="font-bold text-slate-900">{name || "Librarian"}</h3>
              <p className="text-sm text-slate-500">{session?.user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                Librarian
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image URL (ImgBB/Avatar)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}