"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { VideoForm } from "./video-form";
import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { createPresignedUrl } from "@/actions/create-presigned-url";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { uploadToS3 } from "@/lib/upload-to-s3";
import { VideoSchema } from "@/schemas";
import type { SelectVideo } from "@/server/db/schema";
import { api } from "@/trpc/react";

type EditVideoProps = {
  video: SelectVideo;
};

export const EditVideo = ({ video }: EditVideoProps) => {
  const form = useForm<z.infer<typeof VideoSchema>>({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      categories: video.categories || undefined,
      url: video.url,
      transcript: video.transcript || undefined,
      duration: video.duration,
      thumbnail: video.thumbnail || undefined,
    },
  });
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveVideo } = api.video.update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof VideoSchema>) => {
    startTransition(async () => {
      const thumbnail = values.thumbnail;

      if (thumbnail instanceof File) {
        const { fileName } = await uploadToS3({
          file: thumbnail,
          createPresignedUrl: () =>
            createPresignedUrl({
              fileName: video.thumbnail ?? undefined,
            }),
        });
        values.thumbnail = fileName;
        form.setValue("thumbnail", fileName);
      }

      await saveVideo({ ...values, id: video.id });
    });
  };

  const onDelete = async () => {
    isVideoDeleteModalOpenSignal.value = true;
    videoIdSignal.value = video.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit Video"
      backHref="/admin/videos"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <VideoForm form={form} />
    </AdminFormLayout>
  );
};
