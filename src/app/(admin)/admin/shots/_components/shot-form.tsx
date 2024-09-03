import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import type { ShotInsertSchema } from "@/types";
import { usePathname } from "next/navigation";
import { ShotCategorySelect } from "./shot-category-select";

type ShotFormProps = {
  form: UseFormReturn<z.infer<typeof ShotInsertSchema>>;
  categoryOptions?: Option[];
  initialCategories?: string;
};

export const ShotForm = ({
  form,
  initialCategories,
  categoryOptions,
}: ShotFormProps) => {
  const pathname = usePathname();
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Shot details</CardTitle>
            <CardDescription>Fill in the details of the Shot.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="title"
                        className="text-sm"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter description here..."
                        autoComplete="description"
                        className="min-h-32 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="playbackId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">MUX playback ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="pDetWhEkgm9vA01US5fPhPlGec3JbDaCi029MuOZLj64w"
                        autoComplete="playbackId"
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        autoComplete="transcript"
                        className="min-h-32 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
        <Card
          className={cn("w-full", {
            "pointer-events-none opacity-40": pathname.includes("new"),
          })}
        >
          <CardHeader>
            <CardTitle>Shot categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ShotCategorySelect
              categoryOptions={categoryOptions}
              initialCategories={initialCategories}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
