import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
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
import { useAuthContext } from "./auth-context";
import { AuthFormWrapper } from "./auth-form-wrapper";

type AuthCreatePasswordProps = AuthFormSharedProps;

export const AuthCreatePassword = ({ authForm }: AuthCreatePasswordProps) => {
  const { setFormType } = useAuthContext();
  const register = api.auth.register.useMutation();
  const [isPending, startTransition] = useTransition();

  const onBack = () => {
    authForm.resetField("registerPassword");
    authForm.resetField("registerPasswordConfirm");
    authForm.resetField("email");
    setFormType("LANDING");
  };

  const onNextStep = async () => {
    const [registerPassword, email] = authForm.getValues([
      "registerPassword",
      "email",
    ]);

    if (!registerPassword || !email) return;

    const typeCheckSuccess = await authForm.trigger(
      ["registerPassword", "registerPasswordConfirm", "email"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess) return;

    startTransition(async () => {
      const { emailVerification } = await register.mutateAsync({
        email,
        password: registerPassword,
      });
      if (emailVerification) {
        setFormType("VERIFY_EMAIL");
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    });
  };

  return (
    <AuthFormWrapper
      header="Create a password"
      subHeader="Create a password to continue."
      backButton
      backButtonOnClick={onBack}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNextStep();
        }}
        className="space-y-6"
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
                  autoFocus
                  placeholder="******"
                  disabled={isPending}
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
                  disabled={isPending}
                  autoComplete="confirm-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
    </AuthFormWrapper>
  );
};
