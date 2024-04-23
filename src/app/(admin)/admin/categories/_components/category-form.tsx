import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

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
import { type CategorySchema } from "@/schemas";

type CategoryFormProps = {
  form: UseFormReturn<z.infer<typeof CategorySchema>>;
};

export const CategoryForm = ({ form }: CategoryFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid auto-rows-max gap-4 ">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Category details</CardTitle>
            <CardDescription>
              Fill in the details of the Category.
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
                        placeholder="Name of the category..."
                        autoComplete="title"
                        className="text-sm"
                        autoFocus
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
    </div>
  );
};
