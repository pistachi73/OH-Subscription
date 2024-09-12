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
import { api } from "@/trpc/client";
import { type Video, VideoInsertSchema } from "@/types";

type EditVideoProps = {
  video: Video;
};

export const EditVideo = ({ video }: EditVideoProps) => {
  const form = useForm<z.infer<typeof VideoInsertSchema>>({
    resolver: zodResolver(VideoInsertSchema),
    defaultValues: {
      title: video.title,
      description: video.description,
      playbackId: video.playbackId,
      transcript: video.transcript || undefined,
      duration: video.duration,
      thumbnail: video.thumbnail || undefined,
    },
  });
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveVideo } = api.video._update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof VideoInsertSchema>) => {
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
