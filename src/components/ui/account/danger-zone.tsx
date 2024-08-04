"use client";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "../responsive-dialog";

export const DangerZone = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();
  const deleteAccount = api.user.delete.useMutation();

  const onDelete = async () => {
    await deleteAccount.mutateAsync();
    toast.success("Account deleted successfully");
    setIsAlertOpen(false);
    router.push("/");
  };

  return (
    <>
      <Card
        className={cn(
          "shadow-md overflow-hidden border border-destructive transition-colors",
          isOpen && "bg-destructive/10",
        )}
      >
        <CardHeader className="p-2" onClick={() => setIsOpen(!isOpen)}>
          <div className="p-4 flex flex-row gap-2 items-center justify-between cursor-pointer hover:bg-destructive/10 transition-colors rounded-md ">
            <CardTitle className="flex flex-row gap-2 text-xl items-center">
              <TriangleAlert className="w-5 h-5" />
              Danger zone
            </CardTitle>
            <ChevronDown
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </div>
        </CardHeader>
        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: regularEase }}
            >
              <CardContent className="p-6 pt-0 space-y-6">
                <p>
                  Permanently remove your Personal Account and all of its
                  contents from the Vercel platform. This action is not
                  reversible, so please continue with caution.
                </p>
                <div className="w-full flex flex-row items-center justify-end">
                  <Button
                    size={"sm"}
                    type="button"
                    variant={"destructive"}
                    onClick={() => setIsAlertOpen(true)}
                  >
                    Remove account
                  </Button>
                </div>
              </CardContent>
            </m.div>
          )}
        </AnimatePresence>
      </Card>
      <ResponsiveDialog
        open={isAlertOpen}
        onOpenChange={(open) => setIsAlertOpen(open)}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader className="text-balance">
            <ResponsiveDialogTitle>
              Are you absolutely sure?
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <Button variant={"destructive"} onClick={onDelete}>
              Delete account
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};
