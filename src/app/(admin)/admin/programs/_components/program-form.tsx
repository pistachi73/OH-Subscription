"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { AdminFileInput } from "@/components/ui/admin/admin-file-input";
import type { Option } from "@/components/ui/admin/admin-multiple-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_OPTIONS } from "@/lib/formatters/formatLevel";
import { cn } from "@/lib/utils/cn";
import { api } from "@/trpc/react";

import { CategorySelect } from "./category-select";
import { ChapterSelect } from "./chapter-select";
import { TeacherSelect } from "./teacher-select";

import type { ProgramInsertSchema, Video } from "@/types";
import type { ChapterDetails } from "./edit-program";

type ProgramFormProps = {
  form: UseFormReturn<z.infer<typeof ProgramInsertSchema>>;
  programId?: number;
  teacherOptions: Option[];
  videoOptions?: Option[];
  categoryOptions?: Option[];
  videos?: Video[];
  initialTeachers?: string;
  initialChapters?: string;
  initialCategories?: string;
  chapterDetails?: ChapterDetails;
};

export const ProgramForm = ({
  form,
  programId,
  videos,
  teacherOptions,
  videoOptions,
  categoryOptions,
  initialTeachers,
  initialCategories,
  initialChapters,
  chapterDetails,
}: ProgramFormProps) => {
  const pathname = usePathname();

  const generateEmbedding = api.program.generateEmbedding.useMutation({
    onSuccess: () => {
      toast.success("Embedding generated successfully");
    },
  });

  const onGenerateEmbedding = async () => {
    if (!programId) return;
    const [title, description] = form.getValues(["title", "description"]);
    await generateEmbedding.mutateAsync({
      title,
      description,
      id: programId,
    });
  };

  return (
    <Form {...form}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Program details</CardTitle>
              <CardDescription>
                Fill in the details of the Program.
              </CardDescription>
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
                          placeholder="Title of the Program..."
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
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block">Level</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="text-sm transition-colors hover:bg-accent">
                              <SelectValue placeholder="Program level" />
                            </SelectTrigger>
                            <SelectContent side="bottom">
                              {LEVEL_OPTIONS.map(({ label, value }) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                  className="text-sm"
                                >
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <FormLabel className="block">
                          Duration (in min)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
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
                  <FormField
                    control={form.control}
                    name="totalChapters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">Total chapters</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                            autoComplete="totalChapters"
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
              </div>
            </CardContent>
          </Card>
          <Card
            className={cn("w-full", {
              "pointer-events-none opacity-40": pathname.includes("new"),
            })}
          >
            <CardHeader>
              <CardTitle>Program chapters</CardTitle>
              <CardDescription>Add chapters to the Program.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChapterSelect
                videoOptions={videoOptions}
                videos={videos}
                initialChapters={initialChapters}
                initialChapterDetails={chapterDetails}
              />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Button
            className="w-full h-14 text-sm"
            variant="outline"
            disabled={generateEmbedding.isLoading || !programId}
            onClick={onGenerateEmbedding}
            type="button"
          >
            {generateEmbedding.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Generate embeding
          </Button>
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-2">
                        <FormLabel className="block">Published</FormLabel>
                        <FormDescription>
                          Is the Program published
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Program thumbnail</CardTitle>
              <CardDescription>Upload the program thumbnail.</CardDescription>
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
          <Card
            className={cn("w-full", {
              "pointer-events-none opacity-40": pathname.includes("new"),
            })}
          >
            <CardHeader>
              <CardTitle>Program Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <TeacherSelect
                teacherOptions={teacherOptions}
                initialTeachers={initialTeachers}
              />
            </CardContent>
          </Card>
          <Card
            className={cn("w-full", {
              "pointer-events-none opacity-40": pathname.includes("new"),
            })}
          >
            <CardHeader>
              <CardTitle>Program Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CategorySelect
                categoryOptions={categoryOptions}
                initialCategories={initialCategories}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
};
