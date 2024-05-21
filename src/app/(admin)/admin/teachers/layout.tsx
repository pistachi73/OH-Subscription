import type { PropsWithChildren } from "react";

import { DeleteTeacherDialog } from "./_components/delete-teacher-dialog";

const AdminTeachersLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <DeleteTeacherDialog />
    </>
  );
};

export default AdminTeachersLayout;
