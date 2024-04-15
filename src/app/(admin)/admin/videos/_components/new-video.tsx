"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { useRouter } from "next/navigation";

import { VideoForm } from "./video-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { VideoSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const NewVideo = () => {
  const form = useForm<z.infer<typeof VideoSchema>>({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      title: "",
      description: "",
      categories: "",
      url: "",
      transcript: "",
      duration: 0,
    },
  });
  const router = useRouter();

  const { mutateAsync, isLoading: isSaving } = api.video.create.useMutation({
    onSuccess: () => {
      router.push("/admin/videos");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof VideoSchema>) => {
    await mutateAsync(values);
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
