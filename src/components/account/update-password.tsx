"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { regularEase } from "@/lib/animation";
import { cn } from "@/lib/utils/cn";
import { AccountSettingsSchema } from "@/types";

import { api } from "@/trpc/react";

export const UpdatePassword = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof AccountSettingsSchema>>({
    resolver: zodResolver(AccountSettingsSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const update = api.user.update.useMutation();

  const onSubmit = async (values: z.infer<typeof AccountSettingsSchema>) => {
    await update.mutateAsync({
      currentPassword: values.currentPassword,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    toast.success("Password updated successfully");
  };

  if (user.isOAuth) {
    return (
      <Card className="shadow-md overflow-hidden bg-accent/50">
        <CardHeader className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between ">
            <div className="space-y-1">
              <CardTitle className="flex flex-row gap-2 text-xl items-center">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Can't change password bacause you are logged in with OAuth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="p-2" onClick={() => setIsOpen(!isOpen)}>
        <div className="p-4 flex flex-row gap-2 items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-md">
          <div className="space-y-1">
            <CardTitle className="flex flex-row gap-2 text-xl items-center">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>
              Change your password to keep your account secure.
            </CardDescription>
          </div>
          <ChevronDown
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: regularEase }}
          >
            <CardContent className="p-6 pt-0 space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="max-w-[500px]">
                        <FormLabel>Current password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            autoComplete="current-password"
                            className="text-sm"
                            disabled={update.isLoading}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                        <Button
                          size="inline"
                          variant="link"
                          className="text-sm font-light text-muted-foreground"
                          type="button"
                          asChild
                        >
                          <Link href="/forgot-password">Forgot password?</Link>
                        </Button>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="max-w-[500px]">
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            autoComplete="new-password"
                            withValidation={
                              form.formState.dirtyFields.password ||
                              form.formState.errors.password !== undefined
                            }
                            disabled={update.isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="max-w-[500px]">
                        <FormLabel className="flex w-full items-center justify-between">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            autoComplete="confirm-password"
                            disabled={update.isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex flex-row items-center justify-end">
                    <Button
                      size={"sm"}
                      disabled={!form.formState.isDirty || update.isLoading}
                      type="submit"
                    >
                      {update.isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
