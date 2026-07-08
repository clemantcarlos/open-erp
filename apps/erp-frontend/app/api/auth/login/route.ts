import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const res = await fetch(`${API_URL}/auth/local/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.message ?? "Invalid credentials" },
      { status: res.status }
    );
  }

  const { access_token } = data.data.tokens;
  const user = data.data.user;

  // Set httpOnly session cookie with the backend access token
  await createSession({ userId: user.id, email: user.email, accessToken: access_token });

  return NextResponse.json({ ok: true });
}
