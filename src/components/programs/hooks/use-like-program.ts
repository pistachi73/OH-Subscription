import { api } from "@/trpc/react";
import { useState } from "react";

type ProgramCardProps = {
  initialLiked?: boolean;
};

export const useLikeProgram = ({ initialLiked }: ProgramCardProps) => {
  const [isLikedByUser, setIsLikedByUser] = useState(initialLiked);

  const { mutate: likeProgram, isLoading: isLikeLoading } =
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
    likeProgram,
  };
};
