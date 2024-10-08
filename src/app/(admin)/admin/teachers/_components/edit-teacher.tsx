"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignals } from "@preact/signals-react/runtime";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { TeacherForm } from "./teacher-form";
import {
  isTeacherDeleteModalOpenSignal,
  teacherIdSignal,
} from "./teacher-signals";

import { createPresignedUrl } from "@/actions/create-presigned-url";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { uploadToS3 } from "@/lib/upload-to-s3";
import { api } from "@/trpc/client";
import { type Teacher, TeacherInsertSchema } from "@/types";

type EditTeacherProps = {
  teacher: Teacher;
};

export const EditTeacher = ({ teacher }: EditTeacherProps) => {
  useSignals();
  const form = useForm<z.infer<typeof TeacherInsertSchema>>({
    resolver: zodResolver(TeacherInsertSchema),
    defaultValues: {
      name: teacher.name,
      bio: teacher.bio,
      image: teacher.image || undefined,
    },
  });
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveTeacher } = api.teacher._update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof TeacherInsertSchema>) => {
    startTransition(async () => {
      const image = values.image;

      if (image instanceof File) {
        const { fileName } = await uploadToS3({
          file: image,
          createPresignedUrl: () =>
            createPresignedUrl({
              fileName: teacher.image ?? undefined,
            }),
        });
        values.image = fileName;
        form.setValue("image", fileName);
      }

      await saveTeacher({ ...values, id: teacher.id });
    });
  };

  const onDelete = async () => {
    isTeacherDeleteModalOpenSignal.value = true;
    teacherIdSignal.value = teacher.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit teacher"
      backHref="/admin/teachers"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <TeacherForm form={form} />
    </AdminFormLayout>
  );
};
