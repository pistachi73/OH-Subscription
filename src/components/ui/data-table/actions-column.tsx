import { type Signal } from "@preact/signals-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const actionColumn = <T extends { id: number | string }>({
  label,
  openDeleteModalSignal,
  dataPointIdSignal,
}: {
  label: string;
  dataPointIdSignal?: Signal<number | string | null>;
  openDeleteModalSignal?: Signal<boolean>;
}): ColumnDef<T> => {
  return {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.id.toString())}
            >
              Copy {label} ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`edit/${data.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit {label}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (openDeleteModalSignal) {
                  openDeleteModalSignal.value = true;
                }
                if (dataPointIdSignal) {
                  dataPointIdSignal.value = data.id;
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete {label}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
};
