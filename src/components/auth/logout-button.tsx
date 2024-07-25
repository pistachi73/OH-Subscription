"use client";

import { logout } from "@/actions/logout";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  children?: React.ReactNode;
  asChild?: boolean;
};

export const LogoutButton = ({ children, asChild }: LogoutButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    logout();
    router.refresh();
  };

  const Comp = asChild ? Slot : "button";

  return <Comp onClick={onClick}>{children}</Comp>;
};
