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
import { api } from "@/trpc/client";
import { type AdminShot, ShotUpdateSchema } from "@/types";

type EditShotProps = {
  shot: NonNullable<AdminShot>;
  categoryOptions: Option[];
};

export const EditShot = ({ shot, categoryOptions }: EditShotProps) => {
  useSignals();
  const form = useForm<z.infer<typeof ShotUpdateSchema>>({
    resolver: zodResolver(ShotUpdateSchema),
    defaultValues: {
      id: shot.id,
      playbackId: shot.playbackId,
      title: shot.title,
      description: shot.description,
      transcript: shot.transcript ?? "",
    },
  });

  const initialCategories =
    shot?.categories?.map(({ id }) => id.toString()).join(",") ?? "";

  const generateShotEmbedding = api.shot._generateEmbedding.useMutation({
    onSuccess: () => {
      toast.success("Shot embedding generated successfully");
    },
  });

  const saveShot = api.shot._update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof ShotUpdateSchema>) => {
    await saveShot.mutateAsync({ ...values, id: shot.id });
  };

  const onDelete = async () => {
    isShotDeleteModalOpenSignal.value = true;
    shotIdSignal.value = shot.id;
  };

  const onGenerateEmbedding = async () => {
    if (!shot.id) return;
    const [title, description] = form.getValues(["title", "description"]);
    await generateShotEmbedding.mutateAsync({
      title,
      description,
      id: shot.id,
    });
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit shot"
      backHref="/admin/shots"
      onSave={onSave}
      isSaving={saveShot.isPending}
      onDelete={onDelete}
      onGenerateEmbedding={onGenerateEmbedding}
      isGenerateEmbedding={generateShotEmbedding.isPending}
      id={shot.id}
    >
      <ShotForm
        form={form}
        categoryOptions={categoryOptions}
        initialCategories={initialCategories}
      />
    </AdminFormLayout>
  );
};
