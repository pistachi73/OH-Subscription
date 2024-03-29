import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { Inter, Open_Sans, Red_Hat_Mono, Work_Sans } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
  const { deviceType } = getHeaders();
  return (
    <html lang="en">
      <body
        className={`font-inter ${inter.variable} min-h-screen  ${mono.variable} bg-white`}
      >
        <DeviceOnlyProvider deviceType={deviceType}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <SessionProvider session={session}>
              <Toaster />
              <Header />
              {children}
              <Footer />
              <AuthModal />
            </SessionProvider>
          </TRPCReactProvider>
        </DeviceOnlyProvider>
      </body>
    </html>
  );
}
