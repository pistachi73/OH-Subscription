"use client";

import { useRouter } from "next/navigation";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRef, useState } from "react";

type SearchInputProps = InputProps & {
  openWidth?: string;
};

export const SearchInput = ({
  className,
  openWidth = "w-60",
  ...props
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputValue.length) {
        router.push(`/programs/?search=${inputValue}`);
      }
      inputRef.current?.blur();
      setInputValue("");
    }
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-center rounded-sm",
        open && "bg-background/50 border border-foreground transition-[width]",
        open ? openWidth : "w-8 sm:w-10",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center",
          open && "pointer-events-none",
        )}
        aria-label="Search"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="text-foreground w-4 h-4  sm:w-[18px] sm:h-[18px]" />
      </button>
      <Input
        ref={inputRef}
        placeholder="Title, description"
        className={cn(
          "text-sm h-9 transition-all rounded-sm w-full cursor-text border-none bg-transparent px-0 py-0 pl-8 border-0",
          "sm:pl-10 placeholder:text-xs placeholder:text-foreground/70",
          "focus-visible:ring-offset-0 focus-visible:ring-0",
        )}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={onKeyPress}
        onBlur={() => setOpen(false)}
        {...props}
      />
    </div>
  );
};
