import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthPage =
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname === "/auth/register" ||
    request.nextUrl.pathname === "/"
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
}