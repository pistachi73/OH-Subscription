"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { SettingsSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CodeInput } from "../ui/code-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const UpdateEmail = () => {
  const user = useCurrentUser();
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [counter, setCounter] = useState(60);
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      email: user.email ?? "",
      verifycationToken: "",
    },
  });

  const updateEmail = api.user.update.useMutation();

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  const sendVerificationCode = async () => {
    const [email] = form.getValues(["email"]);

    if (!email) return;

    const { verifyEmail } = await updateEmail.mutateAsync({
      email,
    });

    if (!verifyEmail) return;

    toast.success("Verification code sent to your email");
    setCounter(60);
  };

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    const { verifyEmail } = await updateEmail.mutateAsync({
      email: values.email,
      verifycationToken: values.verifycationToken,
    });

    if (verifyEmail) {
      setIsVerifyingEmail(true);
      return;
    }

    toast.success("Email updated successfully");
    form.reset({
      email: values.email,
      verifycationToken: "",
    });
    setIsVerifyingEmail(false);
  };

  if (user.isOAuth) {
    return (
      <Card className="shadow-md overflow-hidden bg-accent/50">
        <CardHeader className="p-2">
          <div className="p-4 flex flex-row gap-2 items-center justify-between ">
            <div className="space-y-1">
              <CardTitle className="flex flex-row gap-2 text-xl items-center">
                <Mail className="w-5 h-5" />
                Email
              </CardTitle>
              <CardDescription>
                Can't change email because you are logged in with OAuth.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <Input
            value={user.email ?? ""}
            className="text-sm max-w-[500px]"
            disabled
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2 text-xl items-center">
          <Mail className="w-5 h-5" />
          Email
        </CardTitle>
        <CardDescription>
          {isVerifyingEmail
            ? "Enter the code sent to your new email!"
            : "Enter the email addresses you want to use to log in with OH."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isVerifyingEmail ? (
              <FormField
                control={form.control}
                name="verifycationToken"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormControl>
                      <CodeInput
                        {...field}
                        length={6}
                        autoFocus
                        disabled={updateEmail.isLoading}
                      />
                    </FormControl>
                    <Button
                      size="inline"
                      variant="link"
                      className={cn(
                        "text-sm font-light text-muted-foreground",
                        {
                          "pointer-events-none": counter > 0,
                        },
                      )}
                      type="button"
                      disabled={updateEmail.isLoading}
                      onClick={() => {
                        counter === 0 && sendVerificationCode();
                      }}
                    >
                      {counter > 0
                        ? `Resend code in ${counter}s`
                        : "Resend code"}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="max-w-[500px]">
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="email"
                        className="text-sm"
                        disabled={updateEmail.isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="w-full flex flex-row items-center justify-end gap-1">
              {isVerifyingEmail && (
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  disabled={updateEmail.isLoading}
                  onClick={() => setIsVerifyingEmail(false)}
                >
                  Back
                </Button>
              )}
              <Button
                disabled={!form.formState.isDirty || updateEmail.isLoading}
                type="submit"
                size="sm"
              >
                {updateEmail.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isVerifyingEmail ? "Verify email" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
