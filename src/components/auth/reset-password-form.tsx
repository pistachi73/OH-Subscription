"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const ResetPasswordForm = () => {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const reset = api.auth.reset.useMutation();

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    reset
      .mutateAsync(values)
      .then(({ success }) => {
        form.reset();
        toast.success(success);
      })
      .catch((e) => {
        if (e instanceof TRPCClientError) {
          toast.error(e.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="name@example.com"
                    disabled={reset.isLoading}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={reset.isLoading} type="submit" className="w-full">
          Send reset email
        </Button>
      </form>
    </Form>
  );
};
