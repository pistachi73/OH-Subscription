import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";

import {
  IBM_Plex_Mono,
  IBM_Plex_Serif,
  Inter,
  Oswald,
  Playfair_Display,
  Red_Hat_Mono,
  Roboto_Serif,
} from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { DeviceOnlyProvider } from "@/components/ui/device-only/device-only-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const oswald = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en">
      <body
        className={`${oswald.variable} font-inter ${inter.variable} min-h-screen  ${mono.variable} bg-muted-background`}
      >
        <DeviceOnlyProvider deviceType={deviceType}>
          <TRPCReactProvider
            cookies={cookies().toString()}
            authorization={authorization?.toString() ?? ""}
          >
            <SessionProvider session={session}>
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </SessionProvider>
          </TRPCReactProvider>
        </DeviceOnlyProvider>
      </body>
    </html>
  );
}
