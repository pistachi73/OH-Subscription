"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { ProgramForm } from "./program-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { api } from "@/trpc/react";
import { ProgramInsertSchema } from "@/types";

type NewProgramProps = {
  teacherOptions: Option[];
};

export const NewProgram = ({ teacherOptions }: NewProgramProps) => {
  const form = useForm<z.infer<typeof ProgramInsertSchema>>({
    resolver: zodResolver(ProgramInsertSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "BEGINNER",
      duration: undefined,
      published: false,
      totalChapters: undefined,
    },
  });

  const router = useRouter();

  const { mutateAsync, isLoading: isSaving } = api.program._create.useMutation({
    onSuccess: () => {
      router.push("/admin/programs");
    },
  });

  const onSave = async (values: z.infer<typeof ProgramInsertSchema>) => {
    await mutateAsync(values);
  };

  return (
    <AdminFormLayout
      form={form}
      title="New program"
      backHref="/admin/programs"
      onSave={onSave}
      isSaving={isSaving}
    >
      <ProgramForm form={form} teacherOptions={teacherOptions} />
    </AdminFormLayout>
  );
};
