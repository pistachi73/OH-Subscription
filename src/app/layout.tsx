import "@/styles/globals.css";

import { Inter, Red_Hat_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { CustomSessionProvider } from "@/components/auth/auth-wrapepr";
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
        className={`font-inter ${inter.variable} min-h-screen  ${mono.variable} bg-muted-background`}
      >
        <CustomSessionProvider session={session}>
          <DeviceOnlyProvider deviceType={deviceType}>
            <TRPCReactProvider
              cookies={cookies().toString()}
              authorization={authorization?.toString() ?? ""}
            >
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </TRPCReactProvider>
          </DeviceOnlyProvider>
        </CustomSessionProvider>
      </body>
    </html>
  );
}
