import { MessageCircleOff, SendHorizonal } from "lucide-react";

import type { AutosizeTextAreaProps } from "@/components/ui/autosize-textarea";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "../button";

import { cn } from "@/lib/utils";
import { useState } from "react";

type AddCommentProps = AutosizeTextAreaProps & {
  commentLabel?: string;
  containerClassName?: string;
  onComment?: (content: string) => Promise<void>;
  onCancel?: () => void;
  cancelLabel?: string;
};

export const AddComment = ({
  containerClassName,
  className,
  onComment,
  commentLabel,
  onCancel,
  cancelLabel,
  ...props
}: AddCommentProps) => {
  const [content, setContent] = useState("");
  const hasLabels = cancelLabel || commentLabel;

  return (
    <div className={cn("relative", containerClassName)}>
      <AutosizeTextarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        minHeight={hasLabels ? 94 : 38}
        className={cn(
          "h-10 overflow-y-hidden p-3 text-xs sm:text-sm resize-none font-light",
          hasLabels ? "h-[96px] pb-[60px]" : "",
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
            type="button"
            variant="default"
            size="sm"
            className="w-9 px-0 text-sm sm:w-fit sm:px-4"
            onClick={async () => {
              await onComment?.(content);
              setContent("");
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
