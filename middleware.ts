import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth_session");
  const isLoginPage = request.nextUrl.pathname === "/auth/login";
  // Cek jika user mencoba akses folder dashboard
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // 1. Kalau mau masuk Dashboard tapi belum login -> Tendang ke Login
  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Kalau sudah login tapi buka halaman Login lagi -> Oper ke Dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config: Tentukan route mana yang kena efek middleware
export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
