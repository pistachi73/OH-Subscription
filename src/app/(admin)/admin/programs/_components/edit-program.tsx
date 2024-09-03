"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ProgramForm } from "./program-form";
import {
  isProgramDeleteModalOpenSignal,
  programIdSignal,
} from "./program-signals";

import { createPresignedUrl } from "@/actions/create-presigned-url";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { uploadToS3 } from "@/lib/upload-to-s3";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { ProgramInsertSchema, type Video } from "@/types";

type EditProgramProps = {
  program: NonNullable<RouterOutputs["program"]["getById"]>;
  teacherOptions: Option[];
  videoOptions: Option[];
  categoryOptions: Option[];
  videos: Video[];
};

export type ChapterDetails = Record<
  number,
  { isFree: boolean; chapterNumber: number }
>;

export const EditProgram = ({
  program,
  teacherOptions,
  videoOptions,
  categoryOptions,
  videos,
}: EditProgramProps) => {
  const trpcUtils = api.useUtils();

  const form = useForm<z.infer<typeof ProgramInsertSchema>>({
    resolver: zodResolver(ProgramInsertSchema),
    defaultValues: {
      title: program.title,
      description: program.description,
      level: program.level,
      duration: program.duration,
      published: program.published || false,
      totalChapters: program.totalChapters,
      thumbnail: program.thumbnail ?? undefined,
    },
  });

  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveVideo } = api.program.update.useMutation({
    onSuccess: ({ id }) => {
      trpcUtils.program.getById.invalidate(id);
      trpcUtils.program.getAll.invalidate();
      toast.success("Program updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const initialTeachers =
    program?.teachers?.map((teacher) => teacher.id.toString()).join(",") ?? "";

  const initialCategories =
    program?.categories?.map((category) => category.id.toString()).join(",") ??
    "";

  const initialChapters =
    program?.chapters?.map((chapter) => chapter.id.toString()).join(",") ?? "";

  const chapterDetails: ChapterDetails =
    program?.chapters?.reduce((acc, { id, chapterNumber, isFree }) => {
      Object.assign(acc, {
        [id]: {
          isFree,
          chapterNumber,
        },
      });
      return acc;
    }, {}) ?? {};

  const onSave = async (values: z.infer<typeof ProgramInsertSchema>) => {
    startTransition(async () => {
      const thumbnail = values.thumbnail;

      if (thumbnail instanceof File) {
        const { fileName } = await uploadToS3({
          file: thumbnail,
          createPresignedUrl: () =>
            createPresignedUrl({
              fileName: program.thumbnail ?? undefined,
            }),
        });

        values.thumbnail = fileName;
        form.setValue("thumbnail", fileName);
      }

      await saveVideo({ ...values, id: program.id });
    });
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
        programId={program.id}
        videoOptions={videoOptions}
        teacherOptions={teacherOptions}
        categoryOptions={categoryOptions}
        videos={videos}
        initialTeachers={initialTeachers}
        initialCategories={initialCategories}
        initialChapters={initialChapters}
        chapterDetails={chapterDetails}
      />
    </AdminFormLayout>
  );
};
