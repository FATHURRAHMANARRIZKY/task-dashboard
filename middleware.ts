import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Cek apakah user punya cookie 'auth_session'
  const isAuthenticated = request.cookies.has("auth_session");

  // 2. Cek apakah user sedang mengakses halaman Login
  const isLoginPage = request.nextUrl.pathname === "/auth/login";

  // Skenario A: User belum login, tapi mau masuk halaman utama (/)
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Skenario B: User sudah login, tapi mau masuk halaman login lagi
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan route mana yang mau dijaga
export const config = {
  matcher: ["/", "/auth/login"],
};
