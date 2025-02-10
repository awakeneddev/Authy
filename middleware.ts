import { errorResponse } from "@/utils/api/responseUtils";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/api/hero"];

export function middleware(req: NextRequest) {
  if (req.method === "GET") {
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = req.cookies.get("Authy")?.value;

    console.log("pathname", req.nextUrl.pathname);
    console.log("token", token);
    if (!token) {
      return errorResponse("Please Login In", "Unauthenticated", 401);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
