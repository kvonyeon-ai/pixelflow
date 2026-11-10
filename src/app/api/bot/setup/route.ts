import { NextResponse } from "next/server";
import {
  getMe,
  getWebhookInfo,
  setWebhook,
  deleteWebhook,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  const [me, webhook] = await Promise.all([getMe(), getWebhookInfo()]);
  return NextResponse.json({ ok: true, me, webhook });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const base: string | undefined = body?.url ?? body?.baseUrl;
    if (!base) {
      return NextResponse.json(
        { ok: false, error: "url is required" },
        { status: 400 }
      );
    }
    const url = base.endsWith("/api/bot") ? base : `${base}/api/bot`;
    await setWebhook(url);
    const webhook = await getWebhookInfo();
    return NextResponse.json({ ok: true, url, webhook });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await deleteWebhook();
  const webhook = await getWebhookInfo();
  return NextResponse.json({ ok: true, webhook });
}
