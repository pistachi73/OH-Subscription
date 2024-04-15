"use client";

import { type ColumnDef } from "@tanstack/react-table";

import Link from "next/link";

import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { actionColumn } from "@/components/ui/data-table/actions-column";
import { type SelectVideo } from "@/server/db/schema";

export const columns: ColumnDef<SelectVideo>[] = [
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
      return (
        <p className="line-clamp-3 max-w-[32ch]">{row.getValue() as string}</p>
      );
    },
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: (row) => {
      return (
        <Button variant="link" className="p-0">
          <Link
            href={row.getValue() as string}
            target="_blank"
            className="max-w-[32ch] truncate"
          >
            {row.getValue() as string}
          </Link>
        </Button>
      );
    },
  },
  actionColumn({
    label: "video",
    dataPointIdSignal: videoIdSignal,
    openDeleteModalSignal: isVideoDeleteModalOpenSignal,
  }),
];

export const VideosTable = ({ data }: { data: SelectVideo[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Videos</CardTitle>
        <CardDescription>Manage your videos.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          searchField="title"
          newHref="videos/new"
        />
      </CardContent>
    </Card>
  );
};
