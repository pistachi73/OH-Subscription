"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { type UserRole } from "@/server/db/schema.types";

type RoleGateProps = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
