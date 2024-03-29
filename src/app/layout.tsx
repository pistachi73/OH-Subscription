import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { Inter, Open_Sans, Red_Hat_Mono, Work_Sans } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
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

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata = {
  title: "OH Subscription",
  description: "",
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
        className={`font-inter ${inter.variable} ${workSans.variable} ${openSans.variable} min-h-screen  ${mono.variable} bg-white`}
      >
        <DeviceOnlyProvider deviceType={deviceType}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <SessionProvider session={session}>
              <Toaster />
              <Header />
              {children}
              <Footer />
            </SessionProvider>
          </TRPCReactProvider>
        </DeviceOnlyProvider>
      </body>
    </html>
  );
}
