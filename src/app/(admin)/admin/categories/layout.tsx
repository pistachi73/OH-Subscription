import type { PropsWithChildren } from "react";

import { DeleteCategoryDialog } from "./_components/delete-category-dialog";

const AdminTeachersLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <DeleteCategoryDialog />
    </>
  );
};

export default AdminTeachersLayout;
