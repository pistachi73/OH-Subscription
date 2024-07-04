"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonOutlineIcon, SunOutlineIcon } from "./ui/icons";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <Button
      className={cn(
        "text-xs lg:text-sm text-shadow-lg font-normal hover:no-underline",
        "text-foreground/80 hover:text-foreground/60",
        "h-9 w-9 px-2",
      )}
      variant="link"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {!mounted ? (
        <MoonOutlineIcon className="w-6" />
      ) : resolvedTheme === "dark" ? (
        <SunOutlineIcon className="w-6" />
      ) : (
        <MoonOutlineIcon className="w-6" />
      )}
    </Button>
  );
}
