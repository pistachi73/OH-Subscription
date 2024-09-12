"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouter } from "next/navigation";

import { CategoryForm } from "./category-form";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { api } from "@/trpc/client";
import { CategoryInsertSchema } from "@/types";

export const NewCategory = () => {
  const trpcUtils = api.useUtils();
  const form = useForm<z.infer<typeof CategoryInsertSchema>>({
    resolver: zodResolver(CategoryInsertSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync, isPending: isSaving } = api.category._create.useMutation(
    {
      onSuccess: () => {
        router.push("/admin/categories");
        toast.success("Category created successfully");
        trpcUtils.category.getAll.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
  const router = useRouter();

  const onSave = async (values: z.infer<typeof CategoryInsertSchema>) => {
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
