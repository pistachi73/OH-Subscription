import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} min-h-screen`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <SessionProvider session={session}>
            <Toaster />
            <Header />
            {children}
            <Footer />
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
