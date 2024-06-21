"use client";

import { useCanRenderFooter } from "./helpers";

import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

export const Footer = () => {
  const canRenderFooter = useCanRenderFooter();

  if (!canRenderFooter) return null;
  return (
    <footer className=" min-h-96 border-t border-input py-16">
      <MaxWidthWrapper>
        <div />
      </MaxWidthWrapper>
    </footer>
  );
};
