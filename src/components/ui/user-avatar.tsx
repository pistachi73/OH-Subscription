import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HSLtoString, generateHSL } from "@/lib/get-random-hsl";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useMemo } from "react";

export const UserAvatar = ({
  className,
  userImage,
  userName,
}: {
  className?: string;
  userImage?: string | null;
  userName?: string | null;
}) => {
  const hslColor = useMemo(() => {
    if (!userName) return undefined;
    return HSLtoString(generateHSL(userName));
  }, [userName]);

  const initials = useMemo(() => {
    if (!userName) return undefined;
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={userImage ?? undefined} />
      <AvatarFallback
        className={cn(userName ? "text-background font-normal" : "bg-accent")}
        style={{ backgroundColor: hslColor }}
      >
        {initials ?? <User className="text-muted-foreground" size={18} />}
      </AvatarFallback>
    </Avatar>
  );
};
