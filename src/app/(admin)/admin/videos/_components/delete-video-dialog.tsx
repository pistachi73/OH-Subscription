"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/react";

export const DeleteVideoDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutateAsync, isLoading: isDeleting } = api.video.delete.useMutation({
    onSuccess: () => {
      isVideoDeleteModalOpenSignal.value = false;
      trpcUtils.video.getAll.invalidate();
      toast.success("Video deleted successfully");
      router.push("/admin/videos");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDelete = async () => {
    const id = videoIdSignal.value;
    if (!id) {
      toast.error("Please provide a video id to delete.");
      return;
    }
    await mutateAsync(id);
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isVideoDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
