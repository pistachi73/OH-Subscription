"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { ShotForm } from "./shot-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { ShotSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const NewShot = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof ShotSchema>>({
    resolver: zodResolver(ShotSchema),
    defaultValues: {
      title: "",
      description: "",
      playbackId: "",
      transcript: "",
    },
  });

  const { mutateAsync, isLoading: isSaving } = api.shot.create.useMutation({
    onSuccess: () => {
      router.push("/admin/shots");
      toast.success("Shot created successfully");
      trpcUtils.shot.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  const onSave = async (values: z.infer<typeof ShotSchema>) => {
    await mutateAsync(values);
  };

  return (
    <AdminFormLayout
      form={form}
      title="New shot"
      backHref="/admin/shots"
      onSave={onSave}
      isSaving={isSaving}
    >
      <ShotForm form={form} />
    </AdminFormLayout>
  );
};
