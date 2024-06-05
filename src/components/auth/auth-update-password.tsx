import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import type { AuthFormSharedProps } from "./auth";
import { AuthFormWrapper } from "./auth-form-wrapper";

type AuthUpdatePasswordProps = AuthFormSharedProps;

export const AuthUpdatePassword = ({ authForm }: AuthUpdatePasswordProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const updatePassword = api.auth.newPassword.useMutation();

  const onPasswordUpdate = async () => {
    const typeCheckSuccess = await authForm.trigger(
      ["registerPassword", "registerPasswordConfirm"],
      {
        shouldFocus: true,
      },
    );

    const [registerPassword] = authForm.getValues(["registerPassword"]);

    if (!typeCheckSuccess || !registerPassword) {
      return;
    }

    updatePassword
      .mutateAsync({ token, values: { password: registerPassword } })
      .then(({ success }) => {
        authForm.reset();
        toast.success(success);
        router.push("/login");
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
    <AuthFormWrapper
      header="Update password"
      subHeader="Please enter a new password for your account."
      className="space-y-6"
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onPasswordUpdate();
        }}
      >
        <FormField
          control={authForm.control}
          name="registerPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="******"
                  disabled={updatePassword.isLoading}
                  autoComplete="new-password"
                  withValidation={
                    authForm.formState.dirtyFields.registerPassword ||
                    authForm.formState.errors.registerPassword !== undefined
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={authForm.control}
          name="registerPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-center justify-between">
                Confirm password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="******"
                  disabled={updatePassword.isLoading}
                  autoComplete="confirm-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-3">
          <Button
            disabled={updatePassword.isLoading}
            type="submit"
            className="w-full"
          >
            {updatePassword.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update
          </Button>
          <Button className="w-full" type="button" variant="ghost">
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </form>
    </AuthFormWrapper>
  );
};
