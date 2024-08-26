import { CheckCheckIcon, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

export const SlugCell = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <button
      className={cn(
        "flex w-fit flex-row items-center gap-2 rounded-sm px-2 py-1  text-xs transition-colors",

        copied
          ? "bg-green-600/20 text-green-600"
          : "bg-accent text-accent-foreground",
      )}
      onClick={onCopy}
      type="button"
    >
      <p>{value}</p>
      {copied ? (
        <CheckCheckIcon size={14} strokeWidth={1} className="shrink-0" />
      ) : (
        <Copy size={14} strokeWidth={1} className="shrink-0" />
      )}
    </button>
  );
};
