import { LogOut, User } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExtendedUser } from "@/next-auth";

export const UserButton = ({ user }: { user: ExtendedUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row gap-1 items-center h-9">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.image || "/images/avatar-placeholder.png"} />
          <AvatarFallback className="bg-accent">
            <User className="text-muted-foreground" size={18} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="">
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
