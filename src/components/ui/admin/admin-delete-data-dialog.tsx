"use client";
import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AdminDeleteDataModalProps = {
  title?: string;
  description?: string;
  isOpenSignal: Signal<boolean>;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
};

export const AdminDeleteDataDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the data point.",
  isOpenSignal,
  onDelete,
  isDeleting,
}: AdminDeleteDataModalProps) => {
  useSignals();

  return (
    <AlertDialog open={isOpenSignal.value}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={() => {
              isOpenSignal.value = false;
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            variant="destructive"
            onClick={async () => {
              await onDelete?.();
            }}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
