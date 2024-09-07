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
  const { mutate: deleteTeacher, isLoading: isDeleting } =
    api.teacher._delete.useMutation({
      onSuccess: () => {
        isTeacherDeleteModalOpenSignal.value = false;
        trpcUtils.teacher._getAll.invalidate();
        toast.success("Teacher deleted successfully");
        router.push("/admin/teachers");
        router.refresh();
      },
    });

  const onDelete = async () => {
    const id = teacherIdSignal.value;
    if (!id) {
      toast.error("Please provide a teacher id to delete.");
      return;
    }
    deleteTeacher({ id });
  };

  return (
    <AdminDeleteDataDialog
      isOpenSignal={isTeacherDeleteModalOpenSignal}
      onDelete={onDelete}
      isDeleting={isDeleting}
    />
  );
};
