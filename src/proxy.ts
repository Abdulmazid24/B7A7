import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ums_token")?.value;
  const role = request.cookies.get("ums_role")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isFacultyRoute = pathname.startsWith("/faculty");
  const isStudentRoute = pathname.startsWith("/student");
  const isProtectedRoute = isAdminRoute || isFacultyRoute || isStudentRoute;

  // 1. If user is logged in and visits login/register, redirect to their dashboard
  if (isAuthRoute && token && role) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "FACULTY") {
      return NextResponse.redirect(new URL("/faculty", request.url));
    }
    if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
  }

  // 2. If visiting a protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Strict Role-Based Access Control (RBAC)
  if (isAdminRoute && role !== "ADMIN") {
    // If not admin, redirect to respective portal or home
    if (role === "FACULTY") return NextResponse.redirect(new URL("/faculty", request.url));
    if (role === "STUDENT") return NextResponse.redirect(new URL("/student", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isFacultyRoute && role !== "FACULTY") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "STUDENT") return NextResponse.redirect(new URL("/student", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isStudentRoute && role !== "STUDENT") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "FACULTY") return NextResponse.redirect(new URL("/faculty", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/faculty/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};
