import { Subscription } from "@/components/ui/account/subscription";
import { getData } from "./getData";

export default async function SubscriptionPage() {
  const data = await getData();

  return <Subscription {...data} />;
}
