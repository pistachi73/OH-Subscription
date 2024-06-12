import { auth } from "@/auth";
import { Plans } from "@/components/plans";
import { redirect } from "next/navigation";

export default async function PlansPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session?.user.stripeSubscriptionId) {
    redirect("/account/subscription/");
  }

  return <Plans />;
}
