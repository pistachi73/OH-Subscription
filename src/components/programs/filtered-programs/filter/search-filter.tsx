"use client";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProgramsUrlQueryFilters } from "../../hooks/use-programs-url-query-filters";

export const SearchFilter = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { searchFilter } = useProgramsUrlQueryFilters();
  const [inputValue, setInputValue] = useState(searchFilter ?? "");
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedValue === "") {
      params.delete("search");
    }
    if (debouncedValue) {
      params.set("search", debouncedValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedValue, router, pathname, searchParams]);

  return (
    <div
      className={cn(
        "bg-accent max-w-72 p-1 h-10 px-3 relative flex w-full items-center gap-2 rounded-sm",
        className,
      )}
    >
      <SearchIcon className="size-6" />

      <input
        placeholder="Title, description"
        className={cn(
          "text-base h-8 transition-all rounded-sm w-full text-accent-foreground cursor-text border-none bg-transparent px-0 py-0 border-0",
          "placeholder:text-sm placeholder:text-accent-foreground/50",
          "focus-visible:ring-offset-0 focus-visible:ring-0",
        )}
        value={inputValue}
        onChange={handleInputChange}
      />

      <Button
        variant={"text-ghost"}
        className="px-0"
        onClick={() => setInputValue("")}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};
