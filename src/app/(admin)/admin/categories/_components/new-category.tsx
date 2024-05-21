"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { CategoryForm } from "./category-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { CategorySchema } from "@/schemas";
import { api } from "@/trpc/react";

export const NewCategory = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync, isLoading: isSaving } = api.category.create.useMutation({
    onSuccess: () => {
      router.push("/admin/categories");
      toast.success("Category created successfully");
      trpcUtils.category.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const router = useRouter();

  const onSave = async (values: z.infer<typeof CategorySchema>) => {
    await mutateAsync(values);
  };

  return (
    <AdminFormLayout
      form={form}
      title="New category"
      backHref="/admin/categories"
      onSave={onSave}
      isSaving={isSaving}
    >
      <CategoryForm form={form} />
    </AdminFormLayout>
  );
};
