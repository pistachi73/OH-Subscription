"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  categoryIdSignal,
  isCategoryDeleteModalOpenSignal,
} from "./category-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/client";

export const DeleteCategoryDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutate: deleteCategory, isPending: isDeleting } =
    api.category._delete.useMutation({
      onSuccess: () => {
        isCategoryDeleteModalOpenSignal.value = false;
        trpcUtils.category.getAll.invalidate();
        toast.success("Category deleted successfully");
        router.push("/admin/categories");
        router.refresh();
      },
    });

  const onDelete = async () => {
    const id = categoryIdSignal.value;
    if (!id) {
      toast.error("Please provide a category id to delete.");
      return;
    }
    deleteCategory({ id });
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isCategoryDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
