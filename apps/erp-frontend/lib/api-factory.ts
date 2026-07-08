import { NextResponse } from "next/server";
import { getAuthHeaders } from "./api-helpers";

const API = process.env.NEST_API_URL || "http://localhost:3000";

export function createCollectionRoute(resource: string) {
  return {
    async GET(request: Request) {
      const { searchParams } = new URL(request.url);
      const qs = searchParams.toString();
      const res = await fetch(`${API}/${resource}${qs ? `?${qs}` : ""}`, {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      return NextResponse.json(data);
    },

    async POST(request: Request) {
      const body = await request.json();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };
      const res = await fetch(`${API}/${resource}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    },

    async PATCH(request: Request) {
      const body = await request.json();
      const { id, ...rest } = body;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      };
      const res = await fetch(`${API}/${resource}/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(rest),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    },

    async DELETE(request: Request) {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      const res = await fetch(`${API}/${resource}/${id}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });
      if (res.status === 204) return new NextResponse(null, { status: 204 });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    },
  };
}

export function createDetailRoute(resource: string) {
  return {
    async GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      const res = await fetch(`${API}/${resource}/${id}`, {
        headers: await getAuthHeaders(),
      });
      if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: res.status });
      const data = await res.json();
      return NextResponse.json(data);
    },
  };
}
