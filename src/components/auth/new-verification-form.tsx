"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { CodeInput } from "../ui/code-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import { FormWrapper } from "./form-wrapper";

import { Button } from "@/components/ui/button";
import { NewVerificationSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const NewVerificationForm = () => {
  const [counter, setCounter] = useState(60);
  const newVerification = api.auth.newVerification.useMutation();

  const form = useForm<z.infer<typeof NewVerificationSchema>>({
    resolver: zodResolver(NewVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  const onSubmit = (values: z.infer<typeof NewVerificationSchema>) => {
    newVerification.mutate({ token: values.code });
  };

  return (
    <FormWrapper
      header="Confirm your email"
      subHeader="We've sent a new email with a verification code."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CodeInput
                      {...field}
                      length={6}
                      disabled={newVerification.isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            size="inline"
            variant="link"
            className="text-sm font-light text-muted-foreground"
            type="button"
            onClick={() => {}}
          >
            Resend code
          </Button>

          <Button
            disabled={newVerification.isLoading}
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};
