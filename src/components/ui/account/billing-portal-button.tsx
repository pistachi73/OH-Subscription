"use client";

import { api } from "@/trpc/react";
import { ChevronRight, CreditCard, Layers, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../button";

type BillingPortalButtonProps = {
  type: "PAYMENT" | "PLAN";
};

const billingPortalButtonMapping: Record<
  "PAYMENT" | "PLAN",
  {
    label: string;
    Icon: typeof ChevronRight;
  }
> = {
  PAYMENT: {
    label: "Manage payment method",
    Icon: CreditCard,
  },
  PLAN: {
    label: "Change plan",
    Icon: Layers,
  },
};

export const BillingPortalButton = ({ type }: BillingPortalButtonProps) => {
  const router = useRouter();
  const createBillingPortalSession =
    api.payment.createBillingPortalSession.useMutation();

  const onCreateBillingPortalSession = async () => {
    try {
      const { billingPortalSession } =
        await createBillingPortalSession.mutateAsync();
      router.push(billingPortalSession.url);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const Icon = billingPortalButtonMapping[type].Icon;
  const label = billingPortalButtonMapping[type].label;

  return (
    <Button
      variant="ghost"
      className="flex flex-row justify-between items-center w-full h-14"
      onClick={onCreateBillingPortalSession}
      disabled={createBillingPortalSession.isLoading}
    >
      <p className="flex gap-2 items-center text-lg font-medium tracking-tighter">
        {createBillingPortalSession.isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Icon size={20} />
        )}
        {label}
      </p>
      <ChevronRight size={16} />
    </Button>
  );
};
