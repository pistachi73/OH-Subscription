"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { VideoForm } from "./video-form";

import { createPresignedUrl } from "@/actions/create-presigned-url";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { uploadToS3 } from "@/lib/upload-to-s3";
import { api } from "@/trpc/react";
import { VideoInsertSchema } from "@/types";

export const NewVideo = () => {
  const form = useForm<z.infer<typeof VideoInsertSchema>>({
    resolver: zodResolver(VideoInsertSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      transcript: "",
      duration: undefined,
    },
  });
  const router = useRouter();
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync } = api.video.create.useMutation({
    onSuccess: () => {
      router.push("/admin/videos");
    },
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
          createPresignedUrl: () => createPresignedUrl({}),
        });
        values.thumbnail = fileName;
        form.setValue("thumbnail", fileName);
      }

      await mutateAsync({ ...values });
    });
  };

  return (
    <AdminFormLayout
      form={form}
      title="New video"
      backHref="/admin/videos"
      onSave={onSave}
      isSaving={isSaving}
    >
      <VideoForm form={form} />
    </AdminFormLayout>
  );
};
