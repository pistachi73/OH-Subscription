import "@/styles/globals.css";

import { Inter, Red_Hat_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CustomSessionProvider } from "@/components/auth/auth-session-provider";
import { Providers } from "@/components/providers";
import { DeviceOnlyProvider } from "@/components/ui/device-only/device-only-provider";
import { Toaster } from "@/components/ui/sonner";
import { getHeaders } from "@/lib/get-headers";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "OH Subscription",
  description: "OH Subscription",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const { deviceType, authorization } = getHeaders();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-inter ${inter.variable} min-h-screen  ${mono.variable} bg-muted-background`}
      >
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
