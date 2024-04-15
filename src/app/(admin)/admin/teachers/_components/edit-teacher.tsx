"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignals } from "@preact/signals-react/runtime";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { TeacherForm } from "./teacher-form";
import {
  isTeacherDeleteModalOpenSignal,
  teacherIdSignal,
} from "./teacher-signals";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { TeacherSchema } from "@/schemas";
import { type SelectTeacher } from "@/server/db/schema";
import { api } from "@/trpc/react";

type EditTeacherProps = {
  teacher: SelectTeacher;
};

export const EditTeacher = ({ teacher }: EditTeacherProps) => {
  useSignals();
  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      name: teacher.name,
      bio: teacher.bio,
      image: undefined,
    },
  });

  const { mutateAsync: saveTeacher, isLoading: isSaving } =
    api.teacher.update.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSave = async (values: z.infer<typeof TeacherSchema>) => {
    await saveTeacher({ ...values, id: teacher.id });
  };
  const onDelete = async () => {
    isTeacherDeleteModalOpenSignal.value = true;
    teacherIdSignal.value = teacher.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="New teacher"
      backHref="/admin/teachers"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <TeacherForm form={form} />
    </AdminFormLayout>
  );
};
