import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import dynamic from "next/dynamic";

const AuthModal = dynamic(
  () => import("@/components/auth/auth-modal").then((mod) => mod.AuthModal),
  {
    ssr: false,
  },
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="overflow-hidden min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
        <Header />
        <main className="relative h-full">{children}</main>
        <Footer />
      </div>
      <AuthModal />
    </>
  );
}
