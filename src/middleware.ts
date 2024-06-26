import NextAuth from "next-auth";

import { NextResponse, userAgent } from "next/server";

import type { DeviceType } from "./components/ui/device-only/device-only-provider";

import authConfig from "@/auth.config";
import { isAdminAuthenticated } from "@/lib/is-admin-authenticated";
import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoute,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "@/routes";
import { VERCEL_HEADERS } from "./lib/get-headers";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const {
    device: { type },
  } = userAgent(req);
  const country = req.geo?.country || "US";
  const deviceType: DeviceType =
    type === "mobile" ? "mobile" : type === "tablet" ? "tablet" : "desktop";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(VERCEL_HEADERS.COUNTRY, country);
  requestHeaders.set(VERCEL_HEADERS.DEVICE_TYPE, deviceType);

  /* Save URL host visible to the user in Header */
  const nextUrlHost = req?.nextUrl?.host;
  requestHeaders.set(VERCEL_HEADERS.HOST, nextUrlHost);

  /* Save PathName in Header */
  const pathName = req?.nextUrl?.pathname;
  const url = req?.url;
  requestHeaders.set(VERCEL_HEADERS.PATHNAME, pathName);
  requestHeaders.set(VERCEL_HEADERS.URL, url);

  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isAdminRoute = nextUrl.pathname.startsWith(adminRoute);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAdminRoute) {
    if (
      (await isAdminAuthenticated(
        req.headers.get("authorization") || req.headers.get("Authorization"),
      )) === false
    ) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic",
        },
      });
    }
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
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
