"use client";

import { useSignals } from "@preact/signals-react/runtime";
import type { ColumnDef } from "@tanstack/react-table";

import { isShotDeleteModalOpenSignal, shotIdSignal } from "./shot-signals";

import { SlugCell } from "@/components/admin/slug-cell";
import { Badge } from "@/components/ui/badge";
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

export const columns: ColumnDef<RouterOutputs["shot"]["_getAll"][0]>[] = [
  {
    accessorKey: "slug",
    header: "Slug",
    cell: (row) => {
      const val = row.getValue() as string;
      return <SlugCell value={val} />;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (row) => {
      return <p className="line-clamp-3">{row.getValue() as string}</p>;
    },
  },
  {
    accessorKey: "embedding",
    header: "Embedding generated",
    cell: (row) => {
      const value = Boolean(row.getValue());
      return (
        <div className="w-full flex justify-center">
          <Badge
            variant={value ? "success" : "accent"}
            className="line-clamp-3 w-fit"
          >
            {value ? "Yes" : "No"}
          </Badge>
        </div>
      );
    },
  },
  actionColumn({
    label: "shot",
    dataPointIdSignal: shotIdSignal,
    openDeleteModalSignal: isShotDeleteModalOpenSignal,
  }),
];

export const ShotsTable = ({
  data,
}: { data: RouterOutputs["shot"]["_getAll"] }) => {
  useSignals();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shots</CardTitle>
        <CardDescription>Manage your shots.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchField="title"
          newHref="new"
        />
      </CardContent>
    </Card>
  );
};
