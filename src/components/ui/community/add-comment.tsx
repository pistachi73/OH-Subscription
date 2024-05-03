import { MessageCircleOff, SendHorizonal } from "lucide-react";
import React from "react";

import { AutosizeTextarea } from "../autosize-textarea";
import { Button } from "../button";
import { type TextareaProps } from "../textarea";

import { cn } from "@/lib/utils";

type AddCommentProps = TextareaProps & {
  commentLabel?: string;
  containerClassName?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

export const AddComment = ({
  onCancel,
  containerClassName,
  className,
  cancelLabel,
  commentLabel,
  ...props
}: AddCommentProps) => {
  const hasLabels = cancelLabel || commentLabel;
  return (
    <div className={cn("relative", containerClassName)}>
      <AutosizeTextarea
        minHeight={hasLabels ? 94 : 38}
        className={cn(
          "h-10 overflow-y-hidden p-3 text-sm",
          hasLabels ? "h-[94px] pb-[60px]" : "",
          className,
        )}
        {...props}
      />

      <div className="absolute bottom-3 right-3 space-x-2 sm:block">
        {cancelLabel && (
          <Button
            variant="secondary"
            size="sm"
            className="w-9 px-0 text-sm sm:w-fit sm:px-4"
            type="button"
            onClick={onCancel}
          >
            <span className="hidden sm:inline-block">{cancelLabel}</span>
            <MessageCircleOff size={14} className="sm:hidden" />
          </Button>
        )}
        {commentLabel && (
          <Button
            variant="default"
            size="sm"
            className="w-9 px-0 text-sm sm:w-fit sm:px-4"
          >
            <span className="hidden sm:inline-block">{commentLabel}</span>
            <SendHorizonal size={14} className="sm:hidden" />
          </Button>
        )}
      </div>
    </div>
  );
};
