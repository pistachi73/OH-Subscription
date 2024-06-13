"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { isShotDeleteModalOpenSignal, shotIdSignal } from "./shot-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/react";

export const DeleteShotDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutateAsync, isLoading: isDeleting } = api.shot.delete.useMutation({
    onSuccess: () => {
      isShotDeleteModalOpenSignal.value = false;
      trpcUtils.shot.getAll.invalidate();
      toast.success("Shot deleted successfully");
      router.push("/admin/shots");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDelete = async () => {
    const id = shotIdSignal.value;
    if (!id) {
      toast.error("Please provide a shot id to delete.");
      return;
    }
    await mutateAsync(id);
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isShotDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
