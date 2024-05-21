import clsx from "clsx";
import { ChevronLeft, Loader2 } from "lucide-react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

import Link from "next/link";

import { Form } from "../ui/form";

import { Button } from "@/components/ui/button";

type AdminFormLayoutProps<T extends FieldValues> = {
  children: React.ReactNode;
  title: string;
  backHref: string;
  form: UseFormReturn<T>;
  onSave: SubmitHandler<T>;
  isSaving?: boolean;
  onDelete?: () => void;
};

export const AdminFormLayout = <T extends FieldValues>({
  children,
  form,
  title,
  onDelete,
  onSave,
  backHref,
  isSaving,
}: AdminFormLayoutProps<T>) => {
  return (
    <div className="mx-auto w-full max-w-[1080px] ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSave(data))}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link href={backHref}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {title}
            </h1>

            <div className=" ml-auto flex items-center gap-2">
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={onDelete}
                  type="button"
                >
                  Delete
                </Button>
              )}

              <Button disabled={isSaving} size="sm" type="submit">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
          <div
            className={clsx({
              "pointer-events-none opacity-50": isSaving,
            })}
          >
            {children}
          </div>
        </form>
      </Form>
    </div>
  );
};
