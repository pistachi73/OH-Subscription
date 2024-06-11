import { auth } from "@/auth";
import { Account } from "@/components/account/account";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <Account />;
}
