import { AuthModal } from "@/components/auth/auth-modal";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="h-full">{children}</main>
      <Footer />
      <AuthModal />
    </>
  );
}
