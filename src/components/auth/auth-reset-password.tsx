import { api } from "@/trpc/client";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import type { AuthFormSharedProps } from "./auth";
import { useAuthContext } from "./auth-context";
import { AuthFormWrapper } from "./auth-form-wrapper";
import { isAuthModalOpenSignal } from "./auth-signals";

type AuthResetPasswordProps = AuthFormSharedProps;

export const AuthResetPassword = ({ authForm }: AuthResetPasswordProps) => {
  useSignals();
  const { setFormType } = useAuthContext();
  const reset = api.auth.reset.useMutation();

  const onBack = () => {
    authForm.reset();
    setFormType("LANDING");
  };
  const onReset = async () => {
    const typeCheckSuccess = await authForm.trigger(["email"], {
      shouldFocus: true,
    });

    const [email] = authForm.getValues(["email"]);

    if (!email || !typeCheckSuccess) {
      return;
    }

    const { success } = await reset.mutateAsync({ email });

    authForm.reset();
    isAuthModalOpenSignal.value = false;
    toast.success(success);
  };

  return (
    <AuthFormWrapper
      header="Reset your password"
      subHeader="Introduce your email and we will send you a link to reset your password."
      backButton
      backButtonOnClick={onBack}
      className="space-y-6"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onReset();
        }}
      >
        <FormField
          control={authForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={reset.isPending} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={reset.isPending}
        >
          {reset.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send link to reset password
        </Button>
      </form>
    </AuthFormWrapper>
  );
};
