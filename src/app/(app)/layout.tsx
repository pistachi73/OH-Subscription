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
      <Header />
      <main className="relative h-full min-h-[50vh]">{children}</main>
      <Footer />
      <AuthModal />
    </>
  );
}
