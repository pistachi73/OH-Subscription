"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { useRouter } from "next/navigation";

import { TeacherForm } from "./teacher-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { TeacherSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const NewTeacher = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      name: "",
      bio: "",
      image: undefined,
    },
  });

  const { mutateAsync, isLoading: isSaving } = api.teacher.create.useMutation({
    onSuccess: () => {
      router.push("/admin/teachers");
      toast.success("Teacher created successfully");
      trpcUtils.teacher.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  const onSave = async (values: z.infer<typeof TeacherSchema>) => {
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
