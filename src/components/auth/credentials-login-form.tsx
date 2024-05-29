"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { useRouter, useSearchParams } from "next/navigation";

import { CodeInput } from "../ui/code-input";
import { PasswordInput } from "../ui/password-input";

import {
  childrenFormSignal,
  isAuthModalOpenSignal,
  needsAuthModalRedirectSignal,
} from "./auth-signals";

import { login } from "@/actions/login";
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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";

export const CredentialsForm = () => {
  useSignals();
  // const { setChildrenForm, childrenFormSignal } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const { error, success, twoFactor } = (await login(values)) ?? {};

      if (error) {
        toast.error(error);
      }

      if (success) {
        form.reset();
        isAuthModalOpenSignal.value = false;
        if (needsAuthModalRedirectSignal.value) {
          router.push(callbackUrl ?? DEFAULT_LOGIN_REDIRECT);
        }
        router.refresh();
      }

      if (twoFactor) {
        // setChildrenForm("two-factor");
        childrenFormSignal.value = "two-factor";
      }
    });
  };

  const isSubmitButtonDisabled =
    isPending ||
    (childrenFormSignal.value === "two-factor" &&
      form.watch("code")?.length !== 6);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {childrenFormSignal.value === "two-factor" && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CodeInput
                      {...field}
                      length={6}
                      disabled={isPending}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {childrenFormSignal.value === "credential" && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Done"
                        disabled={isPending}
                        autoComplete="email"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex w-full items-center justify-between">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="******"
                        disabled={isPending}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                    <Button
                      size="inline"
                      variant="link"
                      className="text-sm font-light text-muted-foreground"
                      type="button"
                      onClick={() => {
                        // setChildrenForm("reset-password");
                        childrenFormSignal.value = "reset-password";
                      }}
                    >
                      Forgot password?
                    </Button>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button
          disabled={isSubmitButtonDisabled}
          type="submit"
          className="w-full"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {childrenFormSignal.value === "two-factor" ? "Confirm" : "Continue"}
        </Button>
      </form>
    </Form>
  );
};
