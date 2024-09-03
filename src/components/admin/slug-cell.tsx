import { CheckCheckIcon, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

export const SlugCell = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      toast.success("Copied to clipboard");
    }, 1000);
  };

  return (
    <button
      className={cn(
        "w-full flex flex-row items-center justify-between gap-2 rounded-sm px-2 py-1  text-xs transition-colors",

        copied
          ? "bg-green-600/20 text-green-600"
          : "bg-accent text-accent-foreground",
      )}
      onClick={onCopy}
      type="button"
    >
      <p className="text-left">{value}</p>
      {copied ? (
        <CheckCheckIcon size={14} strokeWidth={1} className="shrink-0" />
      ) : (
        <Copy size={14} strokeWidth={1} className="shrink-0" />
      )}
    </button>
  );
};
