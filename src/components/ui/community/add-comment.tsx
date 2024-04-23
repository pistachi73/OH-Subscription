import { Button } from "../button";
import { Textarea, type TextareaProps } from "../textarea";

import { cn } from "@/lib/utils";

type AddCommentProps = TextareaProps & {
  commentLabel: string;
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
  return (
    <div className={cn("relative", containerClassName)}>
      <Textarea
        className={cn("min-h-[100px] border-slate-300 p-3 text-sm ", className)}
        placeholder="Add your comment..."
        {...props}
      />

      <div className="absolute bottom-3 right-3 space-x-2">
        {cancelLabel && (
          <Button
            variant="secondary"
            size="sm"
            className="ml-2 text-sm"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}
        <Button variant="default" size="sm" className="text-sm">
          {commentLabel}
        </Button>
      </div>
    </div>
  );
};
