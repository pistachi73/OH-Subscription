import { login } from "@/actions/login";
import { cn } from "@/lib/utils/cn";
import { api } from "@/trpc/react";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { CodeInput } from "../ui/code-input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import type { AuthFormSharedProps } from "./auth";
import { useAuthContext } from "./auth-context";
import { AuthFormWrapper } from "./auth-form-wrapper";
import { isAuthModalOpenSignal } from "./auth-signals";

type AuthEmailVerificationProps = AuthFormSharedProps;

export const AuthEmailVerification = ({
  authForm,
}: AuthEmailVerificationProps) => {
  useSignals();
  const { setFormType } = useAuthContext();
  const register = api.auth.register.useMutation();
  const router = useRouter();
  const [counter, setCounter] = useState(60);

  const sendVerificationCode = async () => {
    const [email, password] = authForm.getValues(["email", "registerPassword"]);

    if (!email || !password) return;

    const { emailVerification } = await register.mutateAsync({
      email,
      password,
    });

    if (!emailVerification) return;

    toast.success("Verification code sent to your email");
    setCounter(60);
  };

  const onNextStep = async () => {
    const [email, password, code] = authForm.getValues([
      "email",
      "registerPassword",
      "code",
    ]);
    const typecheckSuccess = await authForm.trigger(
      ["registerPassword", "code", "email"],
      { shouldFocus: true },
    );

    if (!typecheckSuccess || !email || !password || !code) return;

    const { createdUser } = await register.mutateAsync({
      email,
      password,
      code,
    });

    if (!createdUser) return;

    await login({
      email: createdUser.email,
      password,
    });

    isAuthModalOpenSignal.value = false;
    router.push("/plans");
    router.refresh();
  };

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  return (
    <AuthFormWrapper
      header="Verify your email"
      subHeader="Enter the verification code we sent to your email."
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onNextStep();
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
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={register.isLoading}
        >
          {register.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Verify email
        </Button>
      </form>
    </AuthFormWrapper>
  );
};
