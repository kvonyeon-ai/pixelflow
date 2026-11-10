"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleCheck,
  CircleX,
  ClipboardList,
  Loader2,
  RefreshCw,
} from "lucide-react";

type OrderRow = {
  id: number;
  code: string | null;
  chatId: number;
  username: string | null;
  firstName: string | null;
  language: string;
  service: string;
  details: Record<string, string | number | null>;
  price: number;
  status: string;
  createdAt: string;
};

const SERVICE_NAMES: Record<string, string> = {
  coursework: "Курсовая работа",
  slides: "Слайды",
  thesis: "Тезис",
  article: "Статья",
  web: "Веб-проект",
  bot: "Telegram-бот",
};

const FIELD_NAMES: Record<string, string> = {
  topic: "Тема",
  pages: "Листов",
  deadline: "Срок",
  requirements: "Требования",
  design: "Дизайн",
  botRole: "Сфера бота",
  botFunctions: "Функции",
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "Ждёт оплаты", cls: "border-amber-400/30 bg-amber-500/10 text-amber-300" },
  paid: { label: "Оплачен", cls: "border-sky-400/30 bg-sky-500/10 text-sky-300" },
  done: { label: "Выполнен", cls: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" },
  cancelled: { label: "Отменён", cls: "border-rose-400/30 bg-rose-500/10 text-rose-300" },
};

const FILTERS = ["all", "pending", "paid", "done", "cancelled"] as const;

function fmt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сум";
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setOrders(json.orders);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), 20000);
    return () => clearInterval(id);
  }, [load]);

  const setStatus = async (id: number, status: string) => {
    setBusyId(id);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await load(true);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  return (
    <section className="glass rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/25">
            <ClipboardList className="h-5 w-5" />
          </span>
          <h2 className="font-display text-sm font-semibold tracking-wider text-white uppercase">
            Заказы
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                filter === f
                  ? "border-indigo-400/50 bg-indigo-500/15 text-indigo-200"
                  : "border-slate-700/60 text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "Все" : STATUS_META[f].label}
            </button>
          ))}
          <button
            onClick={() => load()}
            className="rounded-full border border-slate-700/60 p-2 text-slate-500 transition hover:text-slate-300"
            aria-label="Обновить"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading && orders.length === 0 && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700/60 py-12 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Загрузка заказов…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700/60 py-12 text-center text-sm text-slate-500">
            Заказов пока нет — они появятся здесь сразу после оформления в боте.
          </div>
        )}
        {filtered.map((o) => {
          const meta = STATUS_META[o.status] ?? STATUS_META.pending;
          const details = Object.entries(o.details ?? {}).filter(
            ([, v]) => v !== null && v !== ""
          );
          return (
            <article
              key={o.id}
              className="rounded-2xl border border-line bg-ink-2/60 p-5 transition hover:border-indigo-400/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-sm font-semibold text-white">
                      {o.code ?? `PF-${o.id}`}
                    </span>
                    <span className="text-sm text-slate-300">
                      {SERVICE_NAMES[o.service] ?? o.service}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] ${meta.cls}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {o.firstName ?? "Клиент"}
                    {o.username ? ` · @${o.username}` : ""} · id {o.chatId} ·{" "}
                    {new Date(o.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="font-display text-base font-semibold text-white">
                  {fmt(o.price)}
                </span>
              </div>

              {details.length > 0 && (
                <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                  {details.map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="shrink-0 text-slate-500">{FIELD_NAMES[k] ?? k}:</dt>
                      <dd className="break-words text-slate-300">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {o.status !== "done" && o.status !== "cancelled" && (
                  <>
                    {o.status === "pending" && (
                      <button
                        onClick={() => setStatus(o.id, "paid")}
                        disabled={busyId === o.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-50"
                      >
                        {busyId === o.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CircleCheck className="h-3.5 w-3.5" />
                        )}
                        Оплата получена
                      </button>
                    )}
                    <button
                      onClick={() => setStatus(o.id, "done")}
                      disabled={busyId === o.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      {busyId === o.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Выполнен
                    </button>
                    <button
                      onClick={() => setStatus(o.id, "cancelled")}
                      disabled={busyId === o.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      <CircleX className="h-3.5 w-3.5" />
                      Отменить
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
