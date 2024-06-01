"use client";

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
import { getImageUrl } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import {
  isProgramDeleteModalOpenSignal,
  programIdSignal,
} from "./program-signals";

export const columns: ColumnDef<
  NonNullable<RouterOutputs["program"]["getAll"][0]>
>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: (row) => {
      const value = row.getValue();

      return (
        <div className="relative aspect-[4/3] h-16 overflow-hidden rounded-md bg-muted">
          {typeof value === "string" && (
            <Image
              src={getImageUrl(value)}
              alt="thumbnail"
              className=" object-cover"
              fill
            />
          )}{" "}
        </div>
      );
    },
  },
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
      const val = row.getValue() as { category: { name: string } }[];

      if (!val) return null;

      const categories = val.map(({ category }) => category.name).join(",");

      if (!categories.length) return null;

      return (
        <div className="flex flex-row flex-wrap gap-1">
          {categories.split(",").map((category) => (
            <Badge key={category} className="uppercase" variant="accent">
              {category}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: (row) => {
      const value = row.getValue() as string;
      if (!value) return null;
      return <p className="">{format(value, "MMMM d, yyyy")}</p>;
    },
  },
  actionColumn({
    label: "program",
    dataPointIdSignal: programIdSignal,
    openDeleteModalSignal: isProgramDeleteModalOpenSignal,
  }),
];

export const ProgramsTable = ({
  data,
}: {
  data: RouterOutputs["program"]["getAll"];
}) => {
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
          newHref="new"
        />
      </CardContent>
    </Card>
  );
};
