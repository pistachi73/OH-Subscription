import Link from "next/link";
import { redirect } from "next/navigation";

import { EditProgram } from "../../_components/edit-program";

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

type EditProgramPageProps = {
  params: {
    programId: string;
  };
};

const EditProgramPage = async ({
  params: { programId },
}: EditProgramPageProps) => {
  const program = await api.program.getById.query(Number(programId));

  if (!program) {
    redirect("/admin/programs");
  }

  const teachers = await api.teacher.getAll.query();
  const videos = await api.video.getAll.query();
  const categories = await api.category.getAll.query();

  const teachersOptions: Option[] = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: teacher.name,
  }));
  const videoOptions: Option[] = videos.map((video) => ({
    value: video.id.toString(),
    label: video.title,
  }));

  const categoryOptions: Option[] = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
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
