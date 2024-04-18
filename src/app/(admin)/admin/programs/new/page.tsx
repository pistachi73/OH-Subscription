import Link from "next/link";

import { NewProgram } from "../_components/new-program";

import { type Option } from "@/components/ui/admin/admin-multiple-select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

const EditSeriesPage = async () => {
  const teachers = await api.teacher.getAll.query();

  const teachersOptions: Option[] = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: teacher.name,
  }));

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
              <Link href="/admin/programs">All Programs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New Program</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <NewProgram teacherOptions={teachersOptions} />;
    </>
  );
};

export default EditSeriesPage;
