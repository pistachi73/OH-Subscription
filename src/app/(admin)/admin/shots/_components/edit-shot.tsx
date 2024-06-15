"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignals } from "@preact/signals-react/runtime";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ShotForm } from "./shot-form";
import { isShotDeleteModalOpenSignal, shotIdSignal } from "./shot-signals";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { ShotSchema } from "@/schemas";
import type { AdminShot } from "@/server/db/schema.types";
import { api } from "@/trpc/react";

type EditShotProps = {
  shot: NonNullable<AdminShot>;
  categoryOptions: Option[];
};

export const EditShot = ({ shot, categoryOptions }: EditShotProps) => {
  useSignals();
  const form = useForm<z.infer<typeof ShotSchema>>({
    resolver: zodResolver(ShotSchema),
    defaultValues: {
      id: shot.id,
      playbackId: shot.playbackId,
      title: shot.title,
      description: shot.description,
      transcript: shot.transcript ?? "",
    },
  });

  console.log(shot.categories);

  const initialCategories =
    shot?.categories?.map(({ id }) => id.toString()).join(",") ?? "";

  const saveShot = api.shot.update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof ShotSchema>) => {
    await saveShot.mutateAsync({ ...values, id: shot.id });
  };

  const onDelete = async () => {
    isShotDeleteModalOpenSignal.value = true;
    shotIdSignal.value = shot.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit shot"
      backHref="/admin/shots"
      onSave={onSave}
      isSaving={saveShot.isLoading}
      onDelete={onDelete}
    >
      <ShotForm
        form={form}
        categoryOptions={categoryOptions}
        initialCategories={initialCategories}
      />
    </AdminFormLayout>
  );
};
