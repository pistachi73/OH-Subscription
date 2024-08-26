"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils/cn";
import { api } from "@/trpc/react";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthButton } from "../auth/auth-button";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import {
  ANNUAL_PRODUCT_ID,
  MONTHLY_PRODUCT_ID,
  guestChecks,
  memberChecks,
} from "./constants";
import { PlanFrequencySwitch } from "./plan-frequency-switch";

export const Plans = () => {
  const redirectRef = useRef<NodeJS.Timeout>();
  const user = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentFrequency, setPaymentFrequency] = useState<"M" | "A">("M");

  const sessionId = searchParams.get("session_id");

  const createCheckoutSession = api.payment.createCheckoutSession.useMutation();

  useEffect(() => {
    if (sessionId) {
      redirectRef.current = setTimeout(() => {
        router.push("/");
      }, 5000);
    }
    return () => {
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    };
  }, [sessionId, router]);

  const onCreateCheckoutSession = async () => {
    const { checkoutSession } = await createCheckoutSession.mutateAsync({
      productId:
        paymentFrequency === "M" ? MONTHLY_PRODUCT_ID : ANNUAL_PRODUCT_ID,
    });

    if (!checkoutSession.url) {
      toast.error("Something went wrong");
      return;
    }

    router.push(checkoutSession.url);
  };

  const ButtonWrapper = user ? Fragment : AuthButton;

  return (
    <MaxWidthWrapper className="items-center h-ful flex justify-center pt-12 sm:p-32 sm:pt-12 flex-col">
      <div className="w-full flex flex-col items-center sm:max-w-[600px] mx-auto text-center space-y-2 mb-6">
        <Link href="/" className="shrink-0 mb-8">
          <Image
            src={"/images/oh-logo.png"}
            alt="logo"
            width={80}
            height={80}
          />
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
          Choose the right plan for you!
        </h1>
      </div>
      <PlanFrequencySwitch
        paymentFrequency={paymentFrequency}
        setPaymentFrequency={setPaymentFrequency}
      />
      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-0 mt-12 lg:mt-24">
        <Card className="w-full max-w-[450px] origin-center lg:origin-right  transition-transform">
          <CardHeader className="p-9 pb-0 lg:pr-[calc(36px+32px+22px)]">
            <CardTitle>Guest</CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Explore our platform with limited access. Enjoy viewing trailers
              of our series. Upgrade to the Premium Plan to unlock full lessons,
              participate in community discussions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-9 pt-0 lg:pr-[calc(36px+32px+22px)] space-y-9">
            <div className="w-full h-px bg-accent my-9" />
            <div>
              <p className="text-4xl font-bold tracking-tighter text-foreground">
                0€/month
              </p>
              <p className="text-sm text-muted-foreground">Free trial</p>
            </div>

            <ButtonWrapper
              {...(!user
                ? {
                    asChild: true,
                    mode: "modal",
                    redirect: false,
                  }
                : {})}
            >
              <Button
                asChild
                variant="outline"
                className="h-16 text-sm w-full mt-9"
                disabled={createCheckoutSession.isLoading}
              >
                {user ? (
                  <Link href="/">Continue as a guest</Link>
                ) : (
                  <span>Continue as a guest</span>
                )}
              </Button>
            </ButtonWrapper>

            <div className="space-y-4">
              <p className="font-semibold text-foreground ">For guest</p>
              <div className="flex flex-col gap-2">
                {guestChecks.map(({ key, label }) => (
                  <PlanCheck key={key} label={label} checked={false} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full max-w-[450px]  overflow-hidden bg-muted border-muted-foreground shadow-lg  lg:-ml-8 lg:scale-110  transition-transform flex flex-col justify-center">
          <CardHeader className="p-9 pb-0">
            <CardTitle>OH Member</CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Upgrade to the Premium Plan to unlock full lessons, participate in
              community discussions, and access exclusive content.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-9 pt-0 space-y-9">
            <div className="w-full h-px bg-muted-foreground my-9" />
            <div>
              <div className="flex items-center gap-2 relative">
                <p className="text-4xl font-bold tracking-tighter text-foreground">
                  {paymentFrequency === "M" ? "9.99€/month" : "100.99€/year"}
                </p>
                {paymentFrequency === "A" && (
                  <Badge
                    variant="secondary"
                    className="py-1 rounded-sm bg-transparent border-none bg-gradient-to-tr from-secondary to-secondary/80"
                  >
                    15% off
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Billed {paymentFrequency === "M" ? "monthly" : "annually"}
              </p>
            </div>
            <ButtonWrapper
              {...(!user
                ? {
                    asChild: true,
                    mode: "modal",
                    redirect: false,
                  }
                : {})}
            >
              <Button
                variant="default"
                className="h-16 text-sm w-full mt-9"
                {...(user && { onClick: onCreateCheckoutSession })}
                disabled={createCheckoutSession.isLoading}
              >
                {createCheckoutSession.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Become a member
              </Button>
            </ButtonWrapper>

            <div className="space-y-4">
              <p className="font-semibold text-foreground ">For members</p>
              <div className="flex flex-col gap-2">
                {memberChecks.map(({ key, label }) => (
                  <PlanCheck key={key} label={label} checked={true} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};

const PlanCheck = ({ label, checked }: { label: string; checked: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div
        className={cn(
          "h-6 w-6 flex items-center justify-center rounded-full",
          checked
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent text-foreground/30",
        )}
      >
        {checked ? <Check size={16} /> : <X size={16} />}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
