import Link from "next/link";

import { ShotsTable } from "./_components/shot-data-table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

const ShotAdminPage = async () => {
  const shots = await api.shot.getAll.query();

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
            <BreadcrumbPage>All Shots</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ShotsTable data={shots} />
    </>
  );
};

export default ShotAdminPage;
