"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignals } from "@preact/signals-react/runtime";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { CategoryForm } from "./category-form";
import {
  categoryIdSignal,
  isCategoryDeleteModalOpenSignal,
} from "./category-signals";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { api } from "@/trpc/client";
import { type AdminCategory, CategoryInsertSchema } from "@/types";

type EditCategoryProps = {
  category: NonNullable<AdminCategory>;
};

export const EditCategory = ({ category }: EditCategoryProps) => {
  useSignals();
  const form = useForm<z.infer<typeof CategoryInsertSchema>>({
    resolver: zodResolver(CategoryInsertSchema),
    defaultValues: {
      name: category.name,
    },
  });
  const [isSaving, startTransition] = useTransition();

  const { mutateAsync: saveCategory } = api.category._update.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSave = async (values: z.infer<typeof CategoryInsertSchema>) => {
    startTransition(async () => {
      await saveCategory({ ...values, id: category.id });
    });
  };

  const onDelete = async () => {
    isCategoryDeleteModalOpenSignal.value = true;
    categoryIdSignal.value = category.id;
  };

  return (
    <AdminFormLayout
      form={form}
      title="Edit category"
      backHref="/admin/teachers"
      onSave={onSave}
      isSaving={isSaving}
      onDelete={onDelete}
    >
      <CategoryForm form={form} />
    </AdminFormLayout>
  );
};
