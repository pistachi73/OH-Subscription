import Link from "next/link";
import { redirect } from "next/navigation";

import { EditShot } from "../../_components/edit-shot";

import type { Option } from "@/components/ui/admin/admin-multiple-select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

type EditShotPageProps = {
  params: {
    shotId: string;
  };
};

const EditShotPage = async ({ params: { shotId } }: EditShotPageProps) => {
  const shot = await api.shot._getById.query(Number(shotId));

  if (!shot) {
    redirect("/admin/shots");
  }

  const categories = await api.category.getAll.query();

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
              <Link href="/admin/shots">All Shot</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Shot</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditShot shot={shot} categoryOptions={categoryOptions} />
    </>
  );
};

export default EditShotPage;
