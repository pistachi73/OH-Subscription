import { MessageCircleOff, SendHorizonal } from "lucide-react";

import type { AutosizeTextAreaProps } from "@/components/ui/autosize-textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "../button";

import { cn } from "@/lib/utils";
import { useState } from "react";

type AddCommentProps = AutosizeTextAreaProps & {
  controlledValue?: string;
  setControlledValue?: React.Dispatch<React.SetStateAction<string>>;
  commentLabel?: string;
  containerClassName?: string;
  onComment?: (content: string) => Promise<void>;
  onCancel?: () => void;
  cancelLabel?: string;
};

export const AddComment = ({
  controlledValue,
  setControlledValue,
  containerClassName,
  className,
  onComment,
  commentLabel,
  onCancel,
  cancelLabel,
  ...props
}: AddCommentProps) => {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = typeof controlledValue !== "undefined";
  const value = isControlled ? controlledValue : internalValue;
  const hasLabels = cancelLabel || commentLabel;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isControlled) {
      setControlledValue?.(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };
  return (
    <div className={cn("relative", containerClassName)}>
      <AutosizeTextarea
        value={value}
        onChange={onChange}
        minHeight={hasLabels ? 94 : 38}
        className={cn(
          "h-10 overflow-y-hidden p-3 text-xs sm:text-sm resize-none font-light",
          hasLabels ? "h-[96px] pb-[60px]" : "",
          className,
        )}
        {...props}
      />

      <div className="absolute bottom-3 right-3 space-x-1 sm:block">
        {cancelLabel && (
          <Button
            variant="accent"
            size="sm"
            className="w-9 sm:h-8 px-0 text-sm sm:w-fit sm:px-3"
            type="button"
            onClick={onCancel}
          >
            <span className="hidden sm:inline-block">{cancelLabel}</span>
            <MessageCircleOff size={14} className="sm:hidden" />
          </Button>
        )}
        {commentLabel && (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-9 px-0 sm:h-8 text-sm sm:w-fit sm:px-3"
            onClick={async () => {
              await onComment?.(value);
              setInternalValue("");
              setControlledValue?.("");
            }}
          >
            <span className="hidden sm:inline-block">{commentLabel}</span>
            <SendHorizonal size={14} className="sm:hidden" />
          </Button>
        )}
      </div>
    </div>
  );
};
