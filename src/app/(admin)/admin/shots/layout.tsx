import type { PropsWithChildren } from "react";

import { DeleteShotDialog } from "./_components/delete-shot-dialog";

const AdminShotsLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <DeleteShotDialog />
    </>
  );
};

export default AdminShotsLayout;
