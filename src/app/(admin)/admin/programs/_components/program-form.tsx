"use client";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import { usePathname } from "next/navigation";

import { ChaptersTable } from "./chapters-table";

import {
  AdminMultipleSelect,
  type Option,
} from "@/components/ui/admin/admin-multiple-select";
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
import { cn } from "@/lib/utils";
import { type ProgramSchema } from "@/schemas/index";
import { type SelectVideo } from "@/server/db/schema";

type ProgramFormProps = {
  form: UseFormReturn<z.infer<typeof ProgramSchema>>;
  teacherOptions: Option[];
  videoOptions?: Option[];
  videos?: SelectVideo[];
};

const CATEGORY_OPTIONS: Option[] = [
  { label: "Idioms", value: "idions" },
  { label: "Voacabulary", value: "vocabulary" },
  { label: "Grammar", value: "grammar" },
  { label: "Listening", value: "listening" },
  { label: "Conversation", value: "conversation" },
  { label: "Quizz", value: "quizz" },
  { label: "Pronunciation", value: "pronunciation" },
];

const LEVEL_OPTIONS: Option[] = [
  { label: "A1 - A2 Beginner", value: "BEGINNER" },
  { label: "B1 - B2 Intermediate", value: "INTERMEDIATE" },
  { label: "C1 - C2 Advanced", value: "ADVANCED" },
];

export const ProgramForm = ({
  form,
  teacherOptions,
  videoOptions,
  videos,
}: ProgramFormProps) => {
  const pathname = usePathname();

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
              <ChaptersTable videoOptions={videoOptions} videos={videos} />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
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
                          checked={field.value}
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
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Program Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="teachers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AdminMultipleSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={teacherOptions}
                        >
                          Select teachers
                        </AdminMultipleSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Program Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AdminMultipleSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={CATEGORY_OPTIONS}
                        >
                          Select categories
                        </AdminMultipleSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
};
