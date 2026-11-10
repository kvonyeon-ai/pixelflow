import { NextRequest, NextResponse } from "next/server";
import { makeAdminToken } from "@/lib/admin-token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth endpoint itself
  if (pathname === "/api/admin/auth") return NextResponse.next();

  // Protect /admin page and /api/admin/* routes
  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/");

  if (!isAdmin) return NextResponse.next();

  const token = request.cookies.get("pf_admin")?.value;
  const valid = token === makeAdminToken();

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
