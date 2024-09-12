"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { isNumber } from "@/lib/utils/is-number";
import { api } from "@/trpc/client";

type CategorySelectProps = {
  categoryOptions?: Option[];
  initialCategories?: string;
};

export const CategorySelect = ({
  categoryOptions,
  initialCategories = "",
}: CategorySelectProps) => {
  const { programId } = useParams<{ programId: string }>();
  const [categories, setCategories] = useState(initialCategories);

  const { mutate: addCategory } = api.program._addCategory.useMutation();
  const { mutate: removeCategory } = api.program._removeCategory.useMutation();

  const handleAddCategory = (categoryId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    addCategory({
      programId: Number(programId),
      categoryId: Number(categoryId),
    });
  };

  const handleRemoveCategory = (categoryId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }
    removeCategory({
      programId: Number(programId),
      categoryId: Number(categoryId),
    });
  };

  return (
    <AdminMultipleSelect
      value={categories}
      onChange={setCategories}
      options={categoryOptions ?? []}
      onSelect={handleAddCategory}
      onDeselect={handleRemoveCategory}
    >
      Select categories
    </AdminMultipleSelect>
  );
};
