import Link from "next/link";
import { redirect } from "next/navigation";

import { EditVideo } from "../../_components/edit-video";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

type EditVideoPageProps = {
  params: {
    id: string;
  };
};

const EditVideoPage = async ({ params: { id } }: EditVideoPageProps) => {
  const video = await api.video.getById.query(Number(id));

  if (!video) {
    redirect("/admin/videos");
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
              <Link href="/admin/videos">All Video</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Video</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditVideo video={video} />
    </>
  );
};

export default EditVideoPage;
