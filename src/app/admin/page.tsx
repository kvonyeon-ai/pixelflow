import { db } from "@/db";
import { botUsers, orders } from "@/db/schema";
import { fmtNum } from "@/lib/bot/pricing";
import { ArrowLeft, Banknote, CircleDollarSign, ClipboardList, Hourglass, Users } from "lucide-react";
import WebhookPanel from "./webhook-panel";
import OrdersTable from "./orders-table";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pixel Flow — Админ-панель",
};

export default async function AdminPage() {
  let stats = {
    total: 0,
    pending: 0,
    paid: 0,
    done: 0,
    cancelled: 0,
    revenue: 0,
    users: 0,
    dbOk: false,
  };
  try {
    const all = await db.select().from(orders);
    const users = await db.select().from(botUsers);
    stats = {
      total: all.length,
      pending: all.filter((o) => o.status === "pending").length,
      paid: all.filter((o) => o.status === "paid").length,
      done: all.filter((o) => o.status === "done").length,
      cancelled: all.filter((o) => o.status === "cancelled").length,
      revenue: all
        .filter((o) => o.status === "paid" || o.status === "done")
        .reduce((s, o) => s + o.price, 0),
      users: users.length,
      dbOk: true,
    };
  } catch {
    // БД ещё не инициализирована
  }

  const cards = [
    { icon: ClipboardList, label: "Всего заказов", value: String(stats.total) },
    { icon: Hourglass, label: "Ждут оплаты", value: String(stats.pending) },
    { icon: CircleDollarSign, label: "Оплачено / выполнено", value: `${stats.paid} / ${stats.done}` },
    { icon: Banknote, label: "Выручка", value: `${fmtNum(stats.revenue)} сум` },
    { icon: Users, label: "Пользователей бота", value: String(stats.users) },
  ];

  return (
    <main className="grain relative min-h-screen">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              На сайт
            </a>
            <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
              Админ-панель <span className="text-gradient">Pixel Flow</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Заказы из Telegram-бота, оплаты и управление вебхуком
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs ${
              stats.dbOk
                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
                : "border-amber-400/25 bg-amber-500/10 text-amber-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.dbOk ? "bg-emerald-400" : "bg-amber-400"
              } animate-pulse`}
            />
            {stats.dbOk ? "База данных подключена" : "Нет подключения к БД — выполните drizzle-kit push"}
          </span>
          <LogoutButton />
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="glass rounded-2xl p-5">
              <c.icon className="h-4 w-4 text-indigo-300" />
              <p className="mt-3 font-display text-lg font-semibold text-white md:text-xl">
                {c.value}
              </p>
              <p className="mt-1 text-[11px] tracking-wider text-slate-500 uppercase">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <WebhookPanel />
        </div>

        <div className="mt-8">
          <OrdersTable />
        </div>
      </div>
    </main>
  );
}
