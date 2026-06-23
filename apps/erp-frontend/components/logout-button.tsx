"use client";

import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-white bg-zinc-900 px-3 py-1.5 rounded-lg font-medium transition-all shadow-md hover:cursor-pointer hover:bg-zinc-700"
      >
      Logout
    </button>
  );
}
