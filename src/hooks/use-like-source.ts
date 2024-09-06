import { api } from "@/trpc/react";
import { useState } from "react";

type UseLikeSourceProps = {
  initialLiked?: boolean;
};

export const useLikeSource = ({ initialLiked = false }: UseLikeSourceProps) => {
  const [isLikedByUser, setIsLikedByUser] = useState(initialLiked);

  const { mutate: like, isLoading: isLikeLoading } =
    api.like.likeBySourceId.useMutation({
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
    like,
  };
};
