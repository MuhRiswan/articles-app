// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedPage = pathname.startsWith("/") && !isAuthPage;

  // ✅ Jika sudah login dan coba akses /login atau /register, arahkan ke /
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Jika belum login dan coba akses halaman yang dilindungi, arahkan ke /login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 🛡️ Middleware akan aktif di semua route
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
