"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useParams } from "next/navigation";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
import { isNumber } from "@/lib/utils";
import { api } from "@/trpc/react";

type ProgramCategorySelectProps = {
  categoryOptions?: Option[];
  initialCategories?: string;
};

export const ProgramCategorySelect = ({
  categoryOptions,
  initialCategories = "",
}: ProgramCategorySelectProps) => {
  const { programId } = useParams<{ programId: string }>();
  const [categories, setCategories] = useState(initialCategories);

  const { mutateAsync: addCategory } = api.program.addCategory.useMutation();
  const { mutateAsync: removeCategory } =
    api.program.removeCategory.useMutation();

  const [isSelecting, startTransition] = useTransition();

  const handleAddCategory = (categoryId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await addCategory({
        programId: Number(programId),
        categoryId: Number(categoryId),
      });
    });
  };

  const handleRemoveCategory = (categoryId: number) => {
    if (!isNumber(programId)) {
      toast.error("Invalid program id");
    }

    startTransition(async () => {
      await removeCategory({
        programId: Number(programId),
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
