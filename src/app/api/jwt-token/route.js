import { headers } from "next/headers";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ email: session.user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2m")
    .sign(secret);

  return Response.json({ token });
}