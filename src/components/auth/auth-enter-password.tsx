import { login } from "@/actions/login";
import { useLoginSuccess } from "@/hooks/use-login-success";
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

export const AuthEnterPassword = ({ authForm }: AuthCreatePasswordProps) => {
  const { setFormType } = useAuthContext();
  const [isPending, startTransition] = useTransition();
  const onLoginSuccess = useLoginSuccess();

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  const onLogin = async () => {
    const [password, email] = authForm.getValues(["loginPassword", "email"]);

    const typeCheckSuccess = await authForm.trigger(
      ["loginPassword", "email"],
      { shouldFocus: true },
    );

    if (!typeCheckSuccess || !email || !password) return;

    startTransition(async () => {
      const { error, success, twoFactor, isSubscribed } =
        (await login({
          email,
          password,
        })) ?? {};

      if (error) {
        toast.error(error);
        return;
      }

      if (twoFactor) {
        setFormType("TWO_FACTOR");
        return;
      }

      if (success) {
        authForm.reset();
        onLoginSuccess({ isSubscribed: Boolean(isSubscribed) });
      }
    });
  };

  return (
    <AuthFormWrapper
      header="Enter your password"
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
        <input
          type="text"
          name="email"
          value={authForm.getValues("email")}
          readOnly
          autoComplete="email"
          className="hidden"
        />
        <FormField
          control={authForm.control}
          name="loginPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full items-center justify-between">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  autoFocus
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
                  authForm.reset();
                  setFormType("RESET_PASSWORD");
                }}
              >
                Forgot password?
              </Button>
            </FormItem>
          )}
        />
        <Button className="w-full mt-4" type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </AuthFormWrapper>
  );
};
