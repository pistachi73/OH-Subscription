"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/client";

export const DeleteVideoDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutate: deleteVideo, isPending: isDeleting } =
    api.video._delete.useMutation({
      onSuccess: () => {
        isVideoDeleteModalOpenSignal.value = false;
        trpcUtils.video._getAll.invalidate();
        toast.success("Video deleted successfully");
        router.push("/admin/videos");
        router.refresh();
      },
    });

  const onDelete = async () => {
    const id = videoIdSignal.value;
    if (!id) {
      toast.error("Please provide a video id to delete.");
      return;
    }
    deleteVideo({ id });
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isVideoDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
