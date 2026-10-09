import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function refreshJwt() {
  const { data } = await authClient.getSession();
  const email = data?.user?.email;
  if (!email) throw new Error("Please sign in first");

  await fetch(`${API_URL}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
}

export async function adminFetch(path, options = {}) {
  const run = () =>
    fetch(`${API_URL}/api/admin${path}`, {
      credentials: "include",
      ...options,
    });

  let res = await run();

  if (res.status === 401) {
    await refreshJwt();
    res = await run();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}