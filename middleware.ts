import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Ambil token dari cookie
  const token = request.cookies.get("auth_session")?.value;

  // Verifikasi token (Valid atau tidak?)
  const session = await verifySession(token);

  const isLoginPage = request.nextUrl.pathname.startsWith("/auth/login");
  const isRegisterPage = request.nextUrl.pathname.startsWith("/auth/register");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // 1. Kalau mau masuk Dashboard tapi Session tidak valid -> Tendang ke Login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Kalau sudah Login tapi buka Login/Register -> Oper ke Dashboard
  if ((isLoginPage || isRegisterPage) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
