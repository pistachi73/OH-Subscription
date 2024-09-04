"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  isProgramDeleteModalOpenSignal,
  programIdSignal,
} from "./program-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/react";

export const DeleteProgramDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutateAsync, isLoading: isDeleting } =
    api.program._delete.useMutation({
      onSuccess: () => {
        isProgramDeleteModalOpenSignal.value = false;
        trpcUtils.program._getAll.invalidate();
        toast.success("Program deleted successfully");
        router.push("/admin/programs");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onDelete = async () => {
    const id = programIdSignal.value;
    if (!id) {
      toast.error("Please provide a program id to delete.");
      return;
    }
    await mutateAsync(id);
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isProgramDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
