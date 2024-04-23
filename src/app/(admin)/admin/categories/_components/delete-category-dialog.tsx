"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  categoryIdSignal,
  isCategoryDeleteModalOpenSignal,
} from "./category-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/react";

export const DeleteCategoryDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutateAsync, isLoading: isDeleting } =
    api.category.delete.useMutation({
      onSuccess: () => {
        isCategoryDeleteModalOpenSignal.value = false;
        trpcUtils.category.getAll.invalidate();
        toast.success("Category deleted successfully");
        router.push("/admin/categories");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onDelete = async () => {
    const id = categoryIdSignal.value;
    if (!id) {
      toast.error("Please provide a category id to delete.");
      return;
    }
    await mutateAsync(id);
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isCategoryDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
