"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { isNumber } from "@/lib/utils/is-number";
import { api } from "@/trpc/react";

type ShotCategorySelectProps = {
  categoryOptions?: Option[];
  initialCategories?: string;
};

export const ShotCategorySelect = ({
  categoryOptions,
  initialCategories = "",
}: ShotCategorySelectProps) => {
  const { shotId } = useParams<{ shotId: string }>();
  const [categories, setCategories] = useState(initialCategories);

  const { mutateAsync: addCategory } = api.shot.addCategory.useMutation();
  const { mutateAsync: removeCategory } = api.shot.removeCategory.useMutation();

  const [isSelecting, startTransition] = useTransition();

  const handleAddCategory = (categoryId: number) => {
    if (!isNumber(shotId)) {
      toast.error("Invalid shot id");
    }

    startTransition(async () => {
      await addCategory({
        shotId: Number(shotId),
        categoryId: Number(categoryId),
      });
    });
  };

  const handleRemoveCategory = (categoryId: number) => {
    if (!isNumber(shotId)) {
      toast.error("Invalid shot id");
    }

    startTransition(async () => {
      await removeCategory({
        shotId: Number(shotId),
        categoryId: Number(categoryId),
      });
    });
  };

  return (
    <AdminMultipleSelect
      value={categories}
      onChange={setCategories}
      options={categoryOptions ?? []}
      onSelect={handleAddCategory}
      onDeselect={handleRemoveCategory}
      disabled={isSelecting}
    >
      Select categories
    </AdminMultipleSelect>
  );
};
