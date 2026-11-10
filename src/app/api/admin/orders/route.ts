import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import * as tg from "@/lib/telegram";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "paid", "done", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

export async function GET() {
  const list = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return NextResponse.json({ ok: true, orders: list });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const status = body?.status as Status;
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "invalid payload" },
        { status: 400 }
      );
    }
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    // Уведомим клиента о смене статуса
    if (updated && status === "done") {
      const thanks: Record<string, string> = {
        ru: `Заказ ${updated.code} выполнен. Спасибо, что выбрали Pixel Flow!`,
        uz: `Buyurtma ${updated.code} tayyor. Pixel Flow'ni tanlaganingiz uchun rahmat!`,
        en: `Order ${updated.code} is ready. Thank you for choosing Pixel Flow!`,
      };
      await tg.sendMessage(
        updated.chatId,
        thanks[updated.language] ?? thanks.ru
      );
    }
    return NextResponse.json({ ok: true, order: updated });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
