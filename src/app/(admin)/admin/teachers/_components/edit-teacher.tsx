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
import { TeacherSchema } from "@/schemas";
import type { SelectTeacher } from "@/server/db/schema";
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
      image: teacher.image || undefined,
    },
  });
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveTeacher } = api.teacher.update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof TeacherSchema>) => {
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
