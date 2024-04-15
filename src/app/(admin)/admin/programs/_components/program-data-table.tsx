"use client";

import { type ColumnDef } from "@tanstack/react-table";

import {
  isProgramDeleteModalOpenSignal,
  programIdSignal,
} from "./program-signals";

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
import { type SelectProgram } from "@/server/db/schema";

export const columns: ColumnDef<SelectProgram>[] = [
  {
    accessorKey: "id",
    header: "Id",
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
    accessorKey: "level",
    header: "Level",
    cell: (row) => {
      return <Badge variant="success">{row.getValue() as string}</Badge>;
    },
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: (row) => {
      const val = row.getValue() as string;
      return (
        <div className="flex flex-row gap-1">
          {val.split(",").map((category) => (
            <Badge key={category} className="uppercase" variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      );
    },
  },
  actionColumn({
    label: "program",
    dataPointIdSignal: programIdSignal,
    openDeleteModalSignal: isProgramDeleteModalOpenSignal,
  }),
];

export const ProgramsTable = ({ data }: { data: SelectProgram[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Programs</CardTitle>
        <CardDescription>Manage your programs.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchField="title"
          newHref="programs/new"
        />
      </CardContent>
    </Card>
  );
};
