"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import PageShell from "@/components/dashboard/PageShell";

export default function UserProfilePage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Profile update API call ekhane add korben
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="My Profile" subtitle="Manage your account details and preferences">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}`}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border"
            />
            <div>
              <h3 className="font-bold text-slate-900">{name || "User"}</h3>
              <p className="text-sm text-slate-500">{session?.user?.email}</p>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image URL</label>
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}