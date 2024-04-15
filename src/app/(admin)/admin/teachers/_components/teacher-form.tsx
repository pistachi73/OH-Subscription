import { Upload } from "lucide-react";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import Image from "next/image";

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
import { cn } from "@/lib/utils";
import { type TeacherSchema } from "@/schemas";

type TeacherFormProps = {
  form: UseFormReturn<z.infer<typeof TeacherSchema>>;
};

export const TeacherForm = ({ form }: TeacherFormProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Teacher details</CardTitle>
            <CardDescription>
              Fill in the details of the Teacher.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Name of the teacher..."
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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter bio here..."
                        autoComplete="description"
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
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Teacher Images</CardTitle>
            <CardDescription>Upload the image of the teacher.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          onChange={(event) => {
                            if (
                              event.target.files &&
                              event.target.files?.length > 0
                            ) {
                              onChange(event.target.files[0]);
                            }
                          }}
                          {...fieldProps}
                          ref={imageInputRef}
                          className={cn("hidden text-sm")}
                        />

                        {typeof value === "string" ? (
                          <button
                            className="relative aspect-square w-full"
                            onClick={() => {
                              imageInputRef.current?.click();
                            }}
                            type="button"
                          >
                            <Image
                              alt="Teacher image"
                              className="aspect-square w-full rounded-md object-cover"
                              src={value}
                              fill
                            />
                          </button>
                        ) : typeof value === "undefined" ? (
                          <button
                            className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                            onClick={() => {
                              imageInputRef.current?.click();
                            }}
                            type="button"
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </button>
                        ) : (
                          <button
                            className="relative aspect-square w-full"
                            onClick={() => {
                              imageInputRef.current?.click();
                            }}
                            type="button"
                          >
                            <Image
                              alt="Teacher image"
                              className="aspect-square w-full rounded-md object-cover"
                              src={URL.createObjectURL(value)}
                              fill
                            />
                          </button>
                        )}
                      </div>
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
