import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";
import Link from "next/link";
import { ShotContainer } from "./shot-container";

export const BlockedShot = () => {
  const user = useCurrentUser();
  const isLoggedIn = Boolean(user);

  return (
    <ShotContainer className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-20 aspect-square">
        <Image
          src="/images/lock-illustration.svg"
          alt="login required to comment"
          fill
          className="object-contain"
          priority
          sizes="20vw"
        />
      </div>
      <h1 className="text-center text-lg sm:text-xl font-semibold tracking-tighter text-foreground">
        {isLoggedIn ? "Subscription required" : "Login to view this shot"}
      </h1>
      <p className="max-w-[300px] text-center text-sm sm:text-base text-muted-foreground">
        You need to be subscribed to view this shot. Please subscribe to
        continue
      </p>
      {isLoggedIn ? (
        <Button asChild variant={"secondary"} size={"lg"}>
          <Link href="/plans">Upgrade to member plan</Link>
        </Button>
      ) : (
        <AuthButton asChild mode="modal" redirectToIfNotSubscribed={"/plans"}>
          <Button size={"lg"}>Login</Button>
        </AuthButton>
      )}
    </ShotContainer>
  );
};
