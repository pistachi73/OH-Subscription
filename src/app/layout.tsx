import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CustomSessionProvider } from "@/components/auth/auth-session-provider";
import { Providers } from "@/components/providers";
import { DeviceOnlyProvider } from "@/components/ui/device-only/device-only-provider";
import { Toaster } from "@/components/ui/sonner";
import { getHeaders } from "@/lib/get-headers";
import { TRPCReactProvider } from "@/trpc/client";

import "@/styles/globals.css";
import { inter, mono } from "./fonts";

export const metadata = {
  title: "OH Subscription",
  description: "OH Subscription",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const { deviceType, authorization } = getHeaders();
  return (
    <html
      className={`${inter.variable} ${mono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen bg-muted-background">
        <Providers>
          <CustomSessionProvider session={session}>
            <DeviceOnlyProvider deviceType={deviceType}>
              <TRPCReactProvider
                cookies={cookies().toString()}
                authorization={authorization?.toString() ?? ""}
              >
                <Toaster />
                {children}
              </TRPCReactProvider>
            </DeviceOnlyProvider>
          </CustomSessionProvider>
        </Providers>
      </body>
    </html>
  );
}
