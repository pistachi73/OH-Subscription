import { Trash, Upload } from "lucide-react";
import React, { useRef } from "react";

import Image from "next/image";

import { Input, type InputProps } from "../input";

import { cn, getImageUrl } from "@/lib/utils";

interface AdminFileInputProps extends Omit<InputProps, "onChange" | "value"> {
  onChange: (...event: any[]) => void;
  value?: string | File;
}

export const AdminFileInput = React.forwardRef<
  HTMLInputElement,
  AdminFileInputProps
>(({ value, onChange, ...props }, ref) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Input
        type="file"
        onChange={(event) => {
          if (event.target.files && event.target.files?.length > 0) {
            onChange?.(event.target.files[0]);
          }
        }}
        {...props}
        ref={imageInputRef}
        className={cn("hidden text-sm")}
      />

      {typeof value === "string" ? (
        <button
          className="group  relative aspect-square w-full"
          onClick={() => {
            imageInputRef.current?.click();
          }}
          type="button"
        >
          <Image
            alt="Video image"
            className="aspect-square w-full rounded-md object-cover"
            src={getImageUrl(value)}
            fill
          />
          <div
            className="absolute right-2 top-2 flex items-center justify-center rounded-sm bg-destructive/50 p-2 opacity-0 transition-all hover:bg-destructive group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
            role="button"
          >
            <Trash className="text-destructive-foreground" size={16} />
          </div>
        </button>
      ) : !value ? (
        <button
          className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            imageInputRef.current?.click();
          }}
          type="button"
        >
          <Upload className="h-4 w-4 " />
          <span className="sr-only">Upload</span>
        </button>
      ) : (
        <button
          className="relative aspect-square w-full"
          onClick={() => {
            imageInputRef.current?.click();
          }}
          type="button"
        >
          <Image
            alt="Video image"
            className="aspect-square w-full rounded-md object-cover"
            src={URL.createObjectURL(value)}
            fill
          />
        </button>
      )}
    </div>
  );
});
AdminFileInput.displayName = "AdminFileInput";
