"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { VideoForm } from "./video-form";
import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { VideoSchema } from "@/schemas";
import { type SelectVideo } from "@/server/db/schema";
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
      categories: video.categories,
      url: video.url,
      transcript: video.transcript || undefined,
      duration: video.duration,
    },
  });

  const { mutateAsync: saveVideo, isLoading: isSaving } =
    api.video.update.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onSave = async (values: z.infer<typeof VideoSchema>) => {
    await saveVideo({ ...values, id: video.id });
  };

  const onDelete = async () => {
    isVideoDeleteModalOpenSignal.value = true;
    videoIdSignal.value = video.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="New Video"
      backHref="/admin/videos"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <VideoForm form={form} />
    </AdminFormLayout>
  );
};
