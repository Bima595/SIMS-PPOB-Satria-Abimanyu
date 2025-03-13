import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const authRoutes = ["/auth/login", "/auth/register"];

  if (!token && !authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|auth).*)"], 
};

