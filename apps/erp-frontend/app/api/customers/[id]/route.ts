import { NextResponse } from "next/server";

const API = process.env.NEST_API_URL || "http://localhost:3000";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${API}/customers/${id}`);
  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}
