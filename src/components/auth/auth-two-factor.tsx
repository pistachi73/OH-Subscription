import { login } from "@/actions/login";
import { useLoginSuccess } from "@/hooks/use-login-success";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CodeInput } from "../ui/code-input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import type { AuthFormSharedProps } from "./auth";
import { useAuthContext } from "./auth-context";
import { AuthFormWrapper } from "./auth-form-wrapper";

type AuthTwoFactorProps = AuthFormSharedProps;

export const AuthTwoFactor = ({ authForm }: AuthTwoFactorProps) => {
  const { setFormType } = useAuthContext();
  const onLoginSuccess = useLoginSuccess();
  const [isPending, startTransition] = useTransition();

  const onLogin = async () => {
    const [password, email, code] = authForm.getValues([
      "loginPassword",
      "email",
      "code",
    ]);

    const typeCheckSuccess = await authForm.trigger(
      ["loginPassword", "email", "code"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess || !email || !password || !code) return;

    startTransition(async () => {
      const { error, success, isSubscribed } =
        (await login({
          email,
          password,
          code,
        })) ?? {};

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        authForm.reset();
        onLoginSuccess({ isSubscribed: Boolean(isSubscribed) });
      }
    });
  };

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  return (
    <AuthFormWrapper
      header="Two-factor authentication"
      subHeader="Enter the 2FA code we emailed you to continue"
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
      >
        <FormField
          control={authForm.control}
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
        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
      </form>
    </AuthFormWrapper>
  );
};
