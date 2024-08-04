import { useSignals } from "@preact/signals-react/runtime";
import { useRouter } from "next/navigation";

import {
  authModalRedirectToIfNotSubscribed,
  authModalRedirectToSignal,
  isAuthModalOpenSignal,
} from "@/components/auth/auth-signals";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const useLoginSuccess = () => {
  useSignals();
  const router = useRouter();

  const onLoginSuccess = ({ isSubscribed }: { isSubscribed: boolean }) => {
    isAuthModalOpenSignal.value = false;

    if (!isSubscribed && authModalRedirectToIfNotSubscribed.value) {
      router.push(authModalRedirectToIfNotSubscribed.value);
      authModalRedirectToIfNotSubscribed.value = undefined;
      router.refresh();
      return;
    }

    if (authModalRedirectToSignal.value) {
      console.log({ authModalRedirectToSignal });
      const redirectTo =
        authModalRedirectToSignal.value ?? DEFAULT_LOGIN_REDIRECT;
      router.push(redirectTo);
      router.refresh();
      return;
    }

    router.refresh();
  };

  return onLoginSuccess;
};
