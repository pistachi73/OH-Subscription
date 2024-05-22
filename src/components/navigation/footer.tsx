"use client";

import { useCanRenderFooter } from "./helpers";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

export const Footer = () => {
  const canRenderFooter = useCanRenderFooter();

  if (!canRenderFooter) return null;
  return (
    <footer className="mt-20 min-h-40 border-t border-input py-16">
      <MaxWidthWrapper>
        <div />
      </MaxWidthWrapper>
    </footer>
  );
};
