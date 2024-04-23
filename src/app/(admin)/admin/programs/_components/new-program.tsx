"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { useRouter } from "next/navigation";

import { ProgramForm } from "./program-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { type Option } from "@/components/ui/admin/admin-multiple-select";
import { ProgramSchema } from "@/schemas";
import { api } from "@/trpc/react";

type NewProgramProps = {
  teacherOptions: Option[];
};

export const NewProgram = ({ teacherOptions }: NewProgramProps) => {
  const form = useForm<z.infer<typeof ProgramSchema>>({
    resolver: zodResolver(ProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "BEGINNER",
      duration: 0,
      published: false,
      totalChapters: 0,
    },
  });

  const router = useRouter();

  const { mutateAsync, isLoading: isSaving } = api.program.create.useMutation({
    onSuccess: () => {
      router.push("/admin/programs");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof ProgramSchema>) => {
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
