"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { PlanFrequencySwitch } from "./plan-frequency-switch";

const guestChecks = [
  { key: "guest-full-content", label: "Access to full content" },
  { key: "guest-interact-community", label: "Interact with the community" },
  { key: "guest-save-content", label: "Save your favorite content" },
];

const memberChecks = [
  { key: "member-full-content", label: "Access to full content" },
  { key: "member-interact-community", label: "Interact with the community" },
  { key: "member-save-content", label: "Save your favorite content" },
];

export const Plans = () => {
  const [paymentFrequency, setPaymentFrequency] = useState<"M" | "A">("M");
  return (
    <MaxWidthWrapper className="items-center h-ful flex justify-center pt-12 sm:p-32 sm:pt-12 flex-col">
      <div className="w-full sm:max-w-[600px] mx-auto text-center space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
          Choose the right plan for you!
        </h1>
        <p className="text-balance text-base  text-muted-foreground">
          Select the subscription plan that best fits your needs
        </p>
      </div>
      <PlanFrequencySwitch
        paymentFrequency={paymentFrequency}
        setPaymentFrequency={setPaymentFrequency}
      />

      <div className="flex flex-row mt-24">
        <Card className="w-[450px]">
          <CardHeader className="p-9 pb-0 pr-[calc(36px+32px+22px)]">
            <CardTitle>Guest</CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Explore our platform with limited access. Enjoy viewing trailers
              of our series. Upgrade to the Premium Plan to unlock full lessons,
              participate in community discussions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-9 pt-0 pr-[calc(36px+32px+22px)] space-y-9">
            <div className="w-full h-px bg-accent my-9" />
            <div>
              <p className="text-4xl font-bold tracking-tighter text-foreground">
                0€/month
              </p>
              <p className="text-sm text-muted-foreground">Free trial</p>
            </div>
            <Button asChild variant="outline" className="h-16 text-sm w-full">
              <Link href="/">Continue as a guest</Link>
            </Button>

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
        <Card className="w-[450px] overflow-hidden bg-muted border-muted-foreground shadow-lg  -ml-8 scale-110 flex flex-col justify-center">
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
            <Button variant="default" className="h-16 text-sm w-full">
              Become a member
            </Button>

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
