import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils/cn";
import { m } from "framer-motion";
import { useEffect } from "react";
import { useAuthContext } from "./auth-context";

const MotionCard = m(Card);

type FormWrapperProps = {
  children: React.ReactNode;
  header: string;
  subHeader?: string | React.ReactNode;
  backButton?: boolean;
  backButtonOnClick?: () => void;
  className?: string;
};

export const AuthFormWrapper = ({
  children,
  header,
  subHeader,
  backButton,
  backButtonOnClick,
  className,
}: FormWrapperProps) => {
  const { animationDir, setAnimationDir } = useAuthContext();

  useEffect(() => {
    setAnimationDir(1);
  }, []);

  return (
    <MotionCard
      className="w-full border-none bg-transparent shadow-none"
      initial={{ opacity: 0, x: animationDir === 1 ? 20 : -20 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: animationDir === 1 ? -20 : 20,
      }}
      transition={{ duration: 0.15, ease: regularEase }}
    >
      <div className="min-h-[20px]">
        {backButton && (
          <Button
            onClick={async () => {
              await setAnimationDir(-1);
              backButtonOnClick?.();
            }}
            size="inline"
            variant="link"
            type="button"
            className="text-sm text-muted-foreground hover:no-underline"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        )}
      </div>
      <CardHeader className="px-0 py-6">
        <CardTitle className="text-xl sm:text-2xl">{header}</CardTitle>
        <CardDescription className="mt-2 text-sm font-light sm:text-base">
          {subHeader}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("px-0 py-4", className)}>
        {children}
      </CardContent>
    </MotionCard>
  );
};
