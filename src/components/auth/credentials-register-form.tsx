"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import { login } from "@/actions/login";
import { useAuthContext } from "@/components/auth/auth-form-context";
import { Button } from "@/components/ui/button";
import { CodeInput } from "@/components/ui/code-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import { api } from "@/trpc/react";

export const CredentialsRegisterForm = () => {
  const [counter, setCounter] = useState(60);
  const { setEmail, childrenForm, setChildrenForm } = useAuthContext();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      code: "",
    },
  });

  const register = api.auth.register.useMutation();

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    register
      .mutateAsync(values)
      .then(async ({ emailVerification, success }) => {
        if (emailVerification) {
          setEmail(values.email);
          setChildrenForm("email-verification");
          return;
        }

        if (success) {
          toast.success("Account created successfully");
          await login({
            email: values.email,
            password: values.password,
          });
        }
      })
      .catch((error) => {
        if (error instanceof TRPCClientError) {
          if (error.data.cause) {
            form.setError(error.data.cause as any, { message: error.message });
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      });
  };

  const sendVerificationCode = async () => {
    const [email, password, name] = form.getValues([
      "email",
      "password",
      "name",
    ]);

    if (!email && !password && !name) return;

    await register.mutateAsync({
      email,
      password,
      name,
    });

    toast.success("Verification code sent to your email");
    setCounter(60);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {childrenForm === "email-verification" && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CodeInput
                      {...field}
                      length={6}
                      autoFocus
                      disabled={register.isLoading}
                    />
                  </FormControl>
                  <Button
                    size="inline"
                    variant="link"
                    className={cn("text-sm font-light text-muted-foreground", {
                      "pointer-events-none": counter > 0,
                    })}
                    type="button"
                    onClick={() => {
                      counter === 0 && sendVerificationCode();
                    }}
                  >
                    {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {childrenForm === "credential" && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        placeholder="John Done"
                        disabled={register.isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={register.isLoading}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="******"
                        disabled={register.isLoading}
                        withValidation={
                          form.formState.dirtyFields.password ||
                          form.formState.errors.password !== undefined
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <Button disabled={register.isLoading} type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
};
