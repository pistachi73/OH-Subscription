"use client";

import { useSignals } from "@preact/signals-react/runtime";
import type { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";

import {
  isTeacherDeleteModalOpenSignal,
  teacherIdSignal,
} from "./teacher-signals";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { actionColumn } from "@/components/ui/data-table/actions-column";
import { getImageUrl } from "@/lib/utils/get-image-url";

import type { SelectTeacher } from "@/server/db/schema";

export const columns: ColumnDef<SelectTeacher>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: (row) => {
      const value = row.getValue();

      return (
        <div className="relative aspect-square h-16 overflow-hidden rounded-md bg-muted">
          {typeof value === "string" && (
            <Image
              src={getImageUrl(value)}
              alt="thumbnail"
              className=" object-cover"
              fill
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "bio",
    header: "Bio",
    cell: (row) => {
      return <p className="line-clamp-3">{row.getValue() as string}</p>;
    },
  },
  actionColumn({
    label: "teacher",
    openDeleteModalSignal: isTeacherDeleteModalOpenSignal,
    dataPointIdSignal: teacherIdSignal,
  }),
];

export const TeachersTable = ({ data }: { data: SelectTeacher[] }) => {
  useSignals();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers</CardTitle>
        <CardDescription>Manage your teachers.</CardDescription>
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
