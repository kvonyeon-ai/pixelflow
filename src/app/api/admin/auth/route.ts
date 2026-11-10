import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { makeAdminToken, getAdminPassword } from "@/lib/admin-token";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = String(body?.password ?? "").trim();

    if (input !== getAdminPassword()) {
      return NextResponse.json(
        { ok: false, error: "wrong_password" },
        { status: 401 }
      );
    }

    const token = makeAdminToken();
    const res = NextResponse.json({ ok: true });
    (await cookies()).set("pf_admin", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const token = (await cookies()).get("pf_admin")?.value;
  const valid = token === makeAdminToken();
  return NextResponse.json({ ok: valid });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  (await cookies()).delete("pf_admin");
  return res;
}
