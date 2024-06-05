import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import "./plan-frequency-switch.css";

type PlanFrequencySwitchProps = {
  paymentFrequency: "M" | "A";
  setPaymentFrequency: (paymentFrequency: "M" | "A") => void;
};

export const PlanFrequencySwitch = ({
  paymentFrequency,
  setPaymentFrequency,
}: PlanFrequencySwitchProps) => {
  return (
    <div className="relative flex flex-row h-12 bg-foreground dark:bg-background rounded-md">
      <div
        className={cn(
          "bg absolute top-1 left-0 w-[calc(110px-8px)] h-[calc(48px-8px)] rounded-sm z-0",
          paymentFrequency === "M" &&
            "translate-x-1 [--myColor1:hsl(232,34%,35%)] [--myColor2:hsla(232,34%,35%,0.5)]",
          paymentFrequency === "A" &&
            "translate-x-[calc(100%+12px)] [--myColor2:hsl(26.49,95.85%,47.25%)] [--myColor1:hsla(26.49,95.85%,47.25%,0.8)]",
        )}
      />
      <button
        onClick={() => setPaymentFrequency("M")}
        type="button"
        className="text-background w-[110px] flex items-center justify-center"
      >
        <p
          className={cn(
            "transition-all relative z-10 text-sm flex items-center justify-center rounded-sm w-full h-full font-semibold",
            paymentFrequency === "M"
              ? "text-background dark:text-foreground"
              : "text-background/70 dark:text-foreground/70",
          )}
        >
          Monthly
        </p>
      </button>
      <button
        onClick={() => setPaymentFrequency("A")}
        type="button"
        className="relative z-10 text-background w-[110px]  flex items-center justify-center gap-[6px]"
      >
        <p
          className={cn(
            "transition-all relative z-10 text-sm font-semibold",
            paymentFrequency === "A"
              ? "text-background dark:text-foreground"
              : "text-background/70 dark:text-foreground/70",
          )}
        >
          Anually
        </p>
        <Badge
          variant="secondary"
          className={cn(
            "p-0.5 text-2xs shadow-md hover:bg-secondary rounded-sm",
          )}
        >
          -15%
        </Badge>
      </button>
    </div>
  );
};
