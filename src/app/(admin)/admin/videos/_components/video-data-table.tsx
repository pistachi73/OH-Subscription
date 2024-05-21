"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import Image from "next/image";
import Link from "next/link";

import { isVideoDeleteModalOpenSignal, videoIdSignal } from "./video-signals";

import { SlugCell } from "@/components/admin/slug-cell";
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
import { getImageUrl } from "@/lib/utils";
import type { SelectVideo } from "@/server/db/schema";

export const columns: ColumnDef<SelectVideo>[] = [
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
        <Button variant="link" className="p-0 text-sm">
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
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: (row) => {
      const value = row.getValue() as string;
      if (!value) return null;
      return <p className="">{format(value, "d MMMM, yyyy")}</p>;
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
          newHref="new"
        />
      </CardContent>
    </Card>
  );
};
