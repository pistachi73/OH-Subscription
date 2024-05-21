"use client";

import { useSignals } from "@preact/signals-react/runtime";
import type { ColumnDef } from "@tanstack/react-table";

import {
  categoryIdSignal,
  isCategoryDeleteModalOpenSignal,
} from "./category-signals";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { actionColumn } from "@/components/ui/data-table/actions-column";
import type { RouterOutputs } from "@/trpc/shared";

export const columns: ColumnDef<
  NonNullable<RouterOutputs["category"]["getAll"][0]>
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  actionColumn({
    label: "category",
    openDeleteModalSignal: isCategoryDeleteModalOpenSignal,
    dataPointIdSignal: categoryIdSignal,
  }),
];

export const CategoryTable = ({
  data,
}: {
  data: NonNullable<RouterOutputs["category"]["getAll"]>;
}) => {
  useSignals();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Manage your Categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchField="name"
          newHref="new"
        />
      </CardContent>
    </Card>
  );
};
