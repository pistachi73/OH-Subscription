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
import type { TeacherInsertSchema } from "@/types";

type TeacherFormProps = {
  form: UseFormReturn<z.infer<typeof TeacherInsertSchema>>;
};

export const TeacherForm = ({ form }: TeacherFormProps) => {
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
