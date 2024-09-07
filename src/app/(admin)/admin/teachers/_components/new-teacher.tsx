"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { TeacherForm } from "./teacher-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { api } from "@/trpc/react";
import { TeacherInsertSchema } from "@/types";

export const NewTeacher = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof TeacherInsertSchema>>({
    resolver: zodResolver(TeacherInsertSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const { mutateAsync, isLoading: isSaving } = api.teacher._create.useMutation({
    onSuccess: () => {
      router.push("/admin/teachers");
      toast.success("Teacher created successfully");
      trpcUtils.teacher._getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  const onSave = async (values: z.infer<typeof TeacherInsertSchema>) => {
    await mutateAsync(values);
  };

  return (
    <AdminFormLayout
      form={form}
      title="New teacher"
      backHref="/admin/teachers"
      onSave={onSave}
      isSaving={isSaving}
    >
      <TeacherForm form={form} />
    </AdminFormLayout>
  );
};
