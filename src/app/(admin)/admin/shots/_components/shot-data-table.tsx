"use client";

import { useSignals } from "@preact/signals-react/runtime";
import type { ColumnDef } from "@tanstack/react-table";

import { isShotDeleteModalOpenSignal, shotIdSignal } from "./shot-signals";

import { SlugCell } from "@/components/admin/slug-cell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { actionColumn } from "@/components/ui/data-table/actions-column";
import type { Shot } from "@/server/db/schema.types";

export const columns: ColumnDef<Shot>[] = [
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
  actionColumn({
    label: "shot",
    openDeleteModalSignal: isShotDeleteModalOpenSignal,
    dataPointIdSignal: shotIdSignal,
  }),
];

export const ShotsTable = ({ data }: { data: Shot[] }) => {
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
