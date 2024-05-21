import type { PropsWithChildren } from "react";

import { DeleteVideoDialog } from "./_components/delete-video-dialog";

const AdminProgramsLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <DeleteVideoDialog />
    </>
  );
};

export default AdminProgramsLayout;
