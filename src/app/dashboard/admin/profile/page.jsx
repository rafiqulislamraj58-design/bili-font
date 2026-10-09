"use client";

import { authClient } from "@/lib/auth-client";
import PageShell from "@/components/dashboard/PageShell";

export default function AdminProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <PageShell title="My Profile" subtitle="Your account information">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
        {isPending ? (
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <>
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "A"
                  )}&size=128`
                }
                alt={user?.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.name}
                </h2>
                <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium capitalize text-red-700">
                  {user?.role}
                </span>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-slate-100 text-sm">
              <div className="flex justify-between py-3">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{user?.email}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-slate-500">Role</dt>
                <dd className="font-medium capitalize text-slate-900">
                  {user?.role}
                </dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-slate-500">Joined</dt>
                <dd className="font-medium text-slate-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </PageShell>
  );
}