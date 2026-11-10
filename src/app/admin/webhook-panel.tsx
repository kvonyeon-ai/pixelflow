"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  Link2,
  Loader2,
  RefreshCw,
  Trash2,
  Unlink,
} from "lucide-react";

type WebhookInfo = {
  url: string;
  pending_update_count: number;
  last_error_message?: string;
};

type TgMe = { username?: string; first_name?: string };

export default function WebhookPanel() {
  const [me, setMe] = useState<TgMe | null>(null);
  const [hook, setHook] = useState<WebhookInfo | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [busy, setBusy] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/bot/setup", { cache: "no-store" });
      const json = await res.json();
      setMe(json.me ?? null);
      setHook(json.webhook ?? null);
    } catch {
      setMsg("Не удалось получить статус бота");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    load();
  }, [load]);

  const setup = async () => {
    setBusy("set");
    setMsg("");
    try {
      const res = await fetch("/api/bot/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: baseUrl }),
      });
      const json = await res.json();
      setMsg(json.ok ? `Вебхук установлен: ${json.url}` : `Ошибка: ${json.error}`);
      await load();
    } catch (e) {
      setMsg(`Ошибка: ${String(e)}`);
    } finally {
      setBusy("");
    }
  };

  const remove = async () => {
    setBusy("del");
    setMsg("");
    try {
      await fetch("/api/bot/setup", { method: "DELETE" });
      setMsg("Вебхук удалён");
      await load();
    } finally {
      setBusy("");
    }
  };

  const connected = !!hook?.url;

  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-sm font-semibold tracking-wider text-white uppercase">
              Статус Telegram-бота
            </h2>
            <p className="text-xs text-slate-500">
              {loaded
                ? me
                  ? `${me.first_name} · @${me.username}`
                  : "Токен недоступен — проверьте TELEGRAM_BOT_TOKEN"
                : "Загрузка…"}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs ${
            connected
              ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
              : "border-amber-400/25 bg-amber-500/10 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected ? "bg-emerald-400" : "bg-amber-400"
            } animate-pulse`}
          />
          {connected ? "Вебхук активен" : "Вебхук не установлен"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-xl border border-line bg-ink-2/70 px-4">
          <Link2 className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://ваш-домен"
            className="w-full bg-transparent py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
          <span className="hidden shrink-0 text-xs text-slate-600 sm:block">/api/bot</span>
        </label>
        <div className="flex gap-2">
          <button
            onClick={setup}
            disabled={!!busy || !baseUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy === "set" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            Установить
          </button>
          <button
            onClick={remove}
            disabled={!!busy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-rose-500/50 hover:text-rose-300 disabled:opacity-50"
          >
            {busy === "del" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-500">
        {hook?.url && (
          <p className="flex items-center gap-2">
            <Unlink className="h-3.5 w-3.5" />
            <span className="break-all text-slate-400">{hook.url}</span>
            <span>· обновлений в очереди: {hook.pending_update_count}</span>
          </p>
        )}
        {hook?.last_error_message && (
          <p className="text-rose-300/90">Последняя ошибка: {hook.last_error_message}</p>
        )}
        {msg && <p className="text-indigo-300">{msg}</p>}
        <p className="text-slate-600">
          После деплoya нажмите «Установить» — Telegram начнёт присылать сообщения пользователей в
          этот сервер.
        </p>
      </div>
    </section>
  );
}
