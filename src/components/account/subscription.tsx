import type { getData } from "@/app/(app)/account/subscription/getData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memberChecks } from "../plans/constants";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BillingPortalButton } from "./billing-portal-button";

type SubscriptionProps = Awaited<ReturnType<typeof getData>>;
export const Subscription = ({
  price,
  subscription,
  paymentMethod,
  product,
}: SubscriptionProps) => {
  return (
    <div className="flex flex-col gap-9">
      <div className="space-y-2">
        <h1 className="font-bold tracking-tighter text-4xl">Subscription</h1>
        <p className="text-base text-foreground">Manage your OH Subscription</p>
      </div>

      {subscription ? (
        <>
          <Card className="shadow-md relative overflow-hidden">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex flex-row gap-2 text-xl items-center">
                {subscription?.status === "active" ||
                subscription?.status === "trialing"
                  ? "Member plan"
                  : "Guest plan"}
              </CardTitle>
              {subscription?.created && (
                <CardDescription>
                  Active since {format(subscription?.created, "MMM d, yyyy")}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6 pb-0">
              <div className="flex flex-row gap-4">
                <div className="relative aspect-video basis-[200px] h-full w-full rounded-md overflow-hidden">
                  <Image
                    src="/images/hero-thumbnail-2.jpg"
                    alt="subscription plan"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="basis-auto">
                  <p className="text-lg font-semibold ">{product?.name}</p>
                  <p className="text-sm">{price?.price}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-accent w-full py-1">
                  <BillingPortalButton type="PLAN" />
                </div>
                <div className="border-t border-accent w-full py-2">
                  <BillingPortalButton type="PAYMENT" />
                </div>
              </div>
            </CardContent>
          </Card>

          {subscription.currentPeriodEnd && (
            <div className="space-y-2">
              <p className="text-base text-foreground">Payment details</p>
              <Card className="shadow-md p-6 space-y-3">
                <CardTitle className="flex flex-row gap-2 text-xl items-center">
                  Next payment
                </CardTitle>
                <p className="font-medium text-muted-foreground text-base">
                  {format(subscription.currentPeriodEnd, "MMM d yyyy")}
                </p>
                {paymentMethod?.type === "card" && (
                  <p className="font-medium text-muted-foreground flex gap-2 items-center text-sm">
                    <CreditCard size={16} className="text-secondary" />
                    ···· ···· ···· {paymentMethod.card.last4}
                  </p>
                )}
              </Card>
            </div>
          )}
        </>
      ) : (
        <Card className="shadow-md relative overflow-hidden">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
          <CardHeader>
            <CardTitle className="flex flex-row gap-2 text-xl items-center">
              Guest plan
            </CardTitle>
            <CardDescription>
              Upgrade to member plan to enjoy all the benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="flex flex-col gap-3">
              {memberChecks.map(({ key, label }) => (
                <div key={key} className="flex flex-row items-center gap-2">
                  <div
                    className={cn(
                      "h-6 w-6 flex items-center justify-center rounded-full",
                      "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Check size={16} />
                  </div>
                  <p className="text-base text-foreground">{label}</p>
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full h-16" asChild>
              <Link href="/plans">Upgrade to member plan</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
