"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { adminFetch } from "@/lib/adminFetch";
import PageShell, {
  Badge,
  TableSkeleton,
} from "@/components/dashboard/PageShell";

export default function ManageUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all users on mount
  useEffect(() => {
    adminFetch("/users")
      .then((d) => setUsers(d?.users || []))
      .catch((e) => toast.error(e.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  // Change user role
  const changeRole = async (id, role) => {
    try {
      await adminFetch(`/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      setUsers((p) => p.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success(`Role changed to ${role}`);
    } catch (e) {
      toast.error(e.message || "Failed to update role");
    }
  };

  // Delete user
  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminFetch(`/users/${id}`, { method: "DELETE" });
      setUsers((p) => p.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (e) {
      toast.error(e.message || "Failed to delete user");
    }
  };

  // Filter users by name or email
  const filtered = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell title="Manage Users" subtitle="Change roles or remove users">
      {/* Search Input */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:max-w-sm"
      />

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Change Role</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const isMe = u.email === session?.user?.email;
                return (
                  <tr key={u._id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              u.name || "U"
                            )}`
                          }
                          alt={u.name || "User"}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-900">
                          {u.name}
                          {isMe && (
                            <span className="ml-2 text-xs text-slate-400">
                              (you)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <Badge value={u.role || "user"} />
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role || "user"}
                        disabled={isMe}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => remove(u._id)}
                        disabled={isMe}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}