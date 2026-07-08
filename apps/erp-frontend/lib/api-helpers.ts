import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "open-erp-session-secret"
);

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return {};

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    const accessToken = payload.accessToken as string | undefined;
    if (!accessToken) return {};
    return { Authorization: `Bearer ${accessToken}` };
  } catch {
    return {};
  }
}
