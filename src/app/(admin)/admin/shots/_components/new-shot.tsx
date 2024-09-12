"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { ShotForm } from "./shot-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { api } from "@/trpc/client";
import { ShotUpdateSchema } from "@/types";

export const NewShot = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof ShotUpdateSchema>>({
    resolver: zodResolver(ShotUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      playbackId: "",
      transcript: "",
    },
  });

  const { mutateAsync, isPending: isSaving } = api.shot._create.useMutation({
    onSuccess: () => {
      router.push("/admin/shots");
      toast.success("Shot created successfully");
      trpcUtils.shot._getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  const onSave = async (values: z.infer<typeof ShotUpdateSchema>) => {
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
