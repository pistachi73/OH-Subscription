"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { ProgramForm } from "./program-form";
import {
  isProgramDeleteModalOpenSignal,
  programIdSignal,
} from "./program-signals";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { type Option } from "@/components/ui/admin/admin-multiple-select";
import { ProgramSchema } from "@/schemas";
import { type SelectProgram, type SelectVideo } from "@/server/db/schema";
import { api } from "@/trpc/react";

type EditProgramProps = {
  program: SelectProgram;
  teacherOptions: Option[];
  videoOptions: Option[];
  videos: SelectVideo[];
};

export const EditProgram = ({
  program,
  teacherOptions,
  videoOptions,
  videos,
}: EditProgramProps) => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof ProgramSchema>>({
    resolver: zodResolver(ProgramSchema),
    defaultValues: {
      title: program.title,
      description: program.description,
      level: program.level,
      duration: program.duration,
      published: program.published || false,
      categories: program.categories || undefined,
      teachers: program.teachers || undefined,
      totalChapters: program.totalChapters,
    },
  });

  const { mutateAsync: saveVideo, isLoading: isSaving } =
    api.program.update.useMutation({
      onSuccess: ({ id }) => {
        trpcUtils.program.getById.invalidate(id);
        trpcUtils.program.getAll.invalidate();
        toast.success("Program updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSave = async (values: z.infer<typeof ProgramSchema>) => {
    await saveVideo({ ...values, id: program.id });
  };

  const onDelete = async () => {
    isProgramDeleteModalOpenSignal.value = true;
    programIdSignal.value = program.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit program"
      backHref="/admin/programs"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <ProgramForm
        form={form}
        videoOptions={videoOptions}
        teacherOptions={teacherOptions}
        videos={videos}
      />
    </AdminFormLayout>
  );
};
