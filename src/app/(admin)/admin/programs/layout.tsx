import type { PropsWithChildren } from "react";

import { DeleteProgramDialog } from "./_components/delete-program-dialog";

const AdminProgramsLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <DeleteProgramDialog />
    </>
  );
};

export default AdminProgramsLayout;
