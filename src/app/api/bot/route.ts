import { NextResponse } from "next/server";
import { handleUpdate } from "@/lib/bot/engine";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const update = await req.json();
    await handleUpdate(update);
  } catch (e) {
    console.error("webhook handler error:", e);
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "Pixel Flow Bot webhook" });
}
