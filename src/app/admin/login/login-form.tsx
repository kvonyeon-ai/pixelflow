"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const json = await res.json();
      if (json.ok) {
        window.location.href = "/admin";
      } else {
        setError("Неверный пароль");
        setPassword("");
      }
    } catch {
      setError("Ошибка подключения");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Пароль"
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-ink-2/80 px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
          aria-label={show ? "Скрыть пароль" : "Показать пароль"}
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Войти
      </button>
    </form>
  );
}
