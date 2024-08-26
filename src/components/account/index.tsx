import { DangerZone } from "@/components/account/danger-zone";
import { UpdateEmail } from "@/components/account/update-email";
import { UpdateNameAvatar } from "@/components/account/update-name-avatar";
import { UpdatePassword } from "@/components/account/update-password";
import { UpdateTFA } from "@/components/account/update-tfa";

export const Account = () => {
  return (
    <div className="flex flex-col gap-9">
      <div className="space-y-2">
        <h1 className="font-bold tracking-tighter text-4xl">Account</h1>
        <p className="text-base text-foreground">Details of the account</p>
      </div>

      <div className="space-y-4">
        <UpdateNameAvatar />
        <UpdateEmail />
        <UpdatePassword />
        <UpdateTFA />
        <DangerZone />
      </div>
    </div>
  );
};
