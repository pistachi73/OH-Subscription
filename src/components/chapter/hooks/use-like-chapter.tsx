import { api } from "@/trpc/react";
import { useState } from "react";

type ChapterCardProps = {
  initialLiked?: boolean;
};

export const useLikeChapter = ({ initialLiked }: ChapterCardProps) => {
  const [isLikedByUser, setIsLikedByUser] = useState(initialLiked);

  const { mutate: likeChapter, isLoading: isLikeLoading } =
    api.like.like.useMutation({
      onMutate: () => {
        setIsLikedByUser(!isLikedByUser);
      },
      onError: () => {
        setIsLikedByUser(!isLikedByUser);
      },
    });

  return {
    isLikedByUser,
    isLikeLoading,
    likeChapter,
  };
};
