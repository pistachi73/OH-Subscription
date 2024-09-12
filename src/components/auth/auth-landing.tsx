import { api } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
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
import { SocialButton } from "./oauth-button";

type AuthLandingProps = AuthFormSharedProps;

export const AuthLanding = ({ authForm }: AuthLandingProps) => {
  const { setFormType } = useAuthContext();

  const getUserByEmail = api.user.getUserByEmail.useMutation();

  const [isPending, startTransition] = useTransition();

  const onContinue = async () => {
    const success = await authForm.trigger("email", { shouldFocus: true });
    if (!success) return;

    startTransition(async () => {
      console.log("email", authForm.getValues("email"));
      const { user: existingUser, account } = await getUserByEmail.mutateAsync({
        email: authForm.getValues("email"),
      });

      console.log({ existingUser, account });

      if (existingUser && account) {
        return;
      }

      if (existingUser) {
        setFormType("ENTER_PASSWORD");
      } else {
        setFormType("CREATE_PASSWORD");
      }
    });
  };
  return (
    <AuthFormWrapper
      header="Welcome to OH Subscription!"
      subHeader="Log in or register to get started."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <FormField
          control={authForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="email" autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          onClick={onContinue}
          type="submit"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </form>
      <span className="my-6 block w-full text-center text-xs font-medium text-muted-foreground">
        OR
      </span>
      <div className="space-y-3">
        <SocialButton provider="google" />
      </div>
    </AuthFormWrapper>
  );
};
