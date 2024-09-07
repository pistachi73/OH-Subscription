import Link from "next/link";
import { redirect } from "next/navigation";

import { EditTeacher } from "../../_components/edit-teacher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

type EditTeacherPageProps = {
  params: {
    id: string;
  };
};

const EditTeacherPage = async ({ params: { id } }: EditTeacherPageProps) => {
  const teacher = await api.teacher._getById.query(Number(id));

  if (!teacher) {
    redirect("/admin/teachers");
  }

  return (
    <>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/teachers">All Teacher</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Teacher</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditTeacher teacher={teacher} />
    </>
  );
};

export default EditTeacherPage;
