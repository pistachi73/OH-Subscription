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
    id: string;
  };
};

const EditProgramPage = async ({ params: { id } }: EditProgramPageProps) => {
  const program = await api.program.getById.query(Number(id));

  if (!program) {
    redirect("/admin/teachers");
  }
  const teachers = await api.teacher.getAll.query();
  const videos = await api.video.getAll.query();

  const teachersOptions: Option[] = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: teacher.name,
  }));
  const videoOptions: Option[] = videos.map((video) => ({
    value: video.id.toString(),
    label: video.title,
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
              <Link href="/admin/programs">All Program</Link>
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
        videos={videos}
      />
    </>
  );
};

export default EditProgramPage;
