import type { AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { api } from "@/trpc/client";
import { useRef, useState } from "react";
import { COMMENTS_PAGE_SIZE } from "../comment";
import type { ExclusiveCommentSource } from "../comment.types";

type UseEditCommentProps = ExclusiveCommentSource & {
  initialCommentContent: string;
  id: number;
};

export const useEditComment = ({
  id,
  initialCommentContent,
  ...commentSource
}: UseEditCommentProps) => {
  const inputRef = useRef<AutosizeTextAreaRef>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(initialCommentContent ?? "");
  const apiUtils = api.useUtils();

  const { mutateAsync: editComment, isPending: isEditingComment } =
    api.comment.update.useMutation({
      onSuccess: async () => {
        apiUtils.comment.getCommentsBySourceId.setInfiniteData(
          {
            pageSize: COMMENTS_PAGE_SIZE,
            ...commentSource,
          },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                comments: page.comments.map((filteredComment) => {
                  if (filteredComment.id === id) {
                    return {
                      ...filteredComment,
                      content: input,
                    };
                  }
                  return filteredComment;
                }),
              })),
            };
          },
        );

        setIsEditing(false);
      },
    });

  return {
    editComment,
    isEditingComment,
    isEditing,
    setIsEditing,
    input,
    setInput,
    inputRef,
  };
};
