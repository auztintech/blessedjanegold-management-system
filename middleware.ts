import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "APP_ACCESS_TOKEN";
const ROLE_COOKIE = "APP_USER_ROLE";

type Role = "SUPER_ADMIN" | "SALES_PERSON" | "WAREHOUSE_KEEPER";

const roleHome: Record<Role, string> = {
  SUPER_ADMIN: "/dashboard",
  SALES_PERSON: "/sales/dashboard",
  WAREHOUSE_KEEPER: "/warehouse/dashboard",
};

const roleRoutePrefixes: Record<Role, string[]> = {
  SUPER_ADMIN: [
    "/dashboard",
    "/shops",
    "/shop-stock",
    "/warehouses",
    "/warehouse-stock",
    "/categories",    
    "/products",
    "/users",
    "/reports",
    "/activity-log",
    "/sales-history", 
  ],

  SALES_PERSON: ["/sales"],
  WAREHOUSE_KEEPER: ["/warehouse"],
};

const publicPaths = ["/auth/login", "/register", "/forgot-password"];

function pathBelongsToRole(path: string, role: Role) {
  return roleRoutePrefixes[role].some((prefix) => path.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;

  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && role && isPublicPath) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  if (token && role && !isPublicPath && !pathBelongsToRole(pathname, role)) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
