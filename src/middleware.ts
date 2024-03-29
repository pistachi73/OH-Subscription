import NextAuth from "next-auth";

import { NextResponse, userAgent } from "next/server";

import { type DeviceType } from "./components/ui/device-only/device-only-provider";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const {
    device: { type },
  } = userAgent(req);
  const country = req.geo?.country || "US";
  const deviceType: DeviceType =
    type === "mobile" ? "mobile" : type === "tablet" ? "tablet" : "desktop";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-geo-country-code", country);
  requestHeaders.set("x-device-type", deviceType);

  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }
  return NextResponse.next({
    headers: requestHeaders,
  });
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: {
    source: "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    missing: [{ type: "header", key: "next-action" }],
  },
};
