import Link from "next/link";
import { redirect } from "next/navigation";

import { EditProgram } from "../../_components/edit-program";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getSelectOptions } from "@/lib/formatters/get-select-options";
import { api } from "@/trpc/server";

type EditProgramPageProps = {
  params: {
    programId: string;
  };
};

const EditProgramPage = async ({
  params: { programId },
}: EditProgramPageProps) => {
  const [program, teachers, videos, categories] = await Promise.all([
    api.program._getById.query(Number(programId)),
    api.teacher.getAll.query(),
    api.video.getAll.query(),
    api.category.getAll.query(),
  ]);

  if (!program) {
    redirect("/admin/programs");
  }

  const teachersOptions = getSelectOptions({
    objectArr: teachers,
    valueKey: "id",
    labelKey: "name",
  });

  const videoOptions = getSelectOptions({
    objectArr: videos,
    valueKey: "id",
    labelKey: "title",
  });

  const categoryOptions = getSelectOptions({
    objectArr: categories,
    valueKey: "id",
    labelKey: "name",
  });

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
            <BreadcrumbPage>Edit Program</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditProgram
        program={program}
        teacherOptions={teachersOptions}
        videoOptions={videoOptions}
        categoryOptions={categoryOptions}
        videos={videos}
      />
    </>
  );
};

export default EditProgramPage;
