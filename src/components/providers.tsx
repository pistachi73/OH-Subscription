"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      </ThemeProvider>
    </LazyMotion>
  );
};
