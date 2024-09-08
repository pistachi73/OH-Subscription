import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { AdminFileInput } from "@/components/ui/admin/admin-file-input";
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
import type { VideoInsertSchema } from "@/types";

type VideoFormProps = {
  form: UseFormReturn<z.infer<typeof VideoInsertSchema>>;
};

export const VideoForm = ({ form }: VideoFormProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Video details</CardTitle>
            <CardDescription>Fill in the details of the Video.</CardDescription>
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
                        placeholder="Enter title here..."
                        autoComplete="title"
                        className="text-sm"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="playbackId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Url</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter video url here..."
                        autoComplete="url"
                        className="text-sm"
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
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter transcript here..."
                        autoComplete="transcript"
                        className="min-h-32 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Duration (in min)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number.parseInt(e.target.value));
                        }}
                        autoComplete="duration"
                        className="remove-number-arrows text-sm"
                        type="number"
                        min={0}
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
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Video thumbnail</CardTitle>
            <CardDescription>Upload the video thumbnail.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <AdminFileInput
                        value={value}
                        onChange={onChange}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
