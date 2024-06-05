import { LogOut } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExtendedUser } from "@/next-auth";
import { UserAvatar } from "../ui/user-avatar";

export const UserButton = ({ user }: { user: ExtendedUser }) => {
  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          userImage={user.image}
          userName={user.name}
          className="h-9 w-9"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
