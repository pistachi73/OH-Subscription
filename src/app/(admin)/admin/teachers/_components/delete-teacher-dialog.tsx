"use client";
import { useSignals } from "@preact/signals-react/runtime";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import {
  isTeacherDeleteModalOpenSignal,
  teacherIdSignal,
} from "./teacher-signals";

import { AdminDeleteDataDialog } from "@/components/ui/admin/admin-delete-data-dialog";
import { api } from "@/trpc/react";

export const DeleteTeacherDialog = () => {
  useSignals();
  const trpcUtils = api.useUtils();
  const router = useRouter();
  const { mutateAsync, isLoading: isDeleting } = api.teacher.delete.useMutation(
    {
      onSuccess: () => {
        isTeacherDeleteModalOpenSignal.value = false;
        trpcUtils.teacher.getAll.invalidate();
        toast.success("Teacher deleted successfully");
        router.push("/admin/teachers");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const onDelete = async () => {
    const id = teacherIdSignal.value;
    if (!id) {
      toast.error("Please provide a teacher id to delete.");
      return;
    }
    await mutateAsync(id);
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isTeacherDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
