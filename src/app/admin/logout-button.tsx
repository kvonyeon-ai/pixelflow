"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin";
  };

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1.5 text-xs text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300"
    >
      <LogOut className="h-3.5 w-3.5" />
      Выйти
    </button>
  );
}
