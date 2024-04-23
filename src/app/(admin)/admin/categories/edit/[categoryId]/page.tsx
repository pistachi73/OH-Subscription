import Link from "next/link";
import { redirect } from "next/navigation";

import { EditCategory } from "../../_components/edit-category";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/trpc/server";

type EditCategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const EditCategoryPage = async ({
  params: { categoryId },
}: EditCategoryPageProps) => {
  const category = await api.category.getById.query(Number(categoryId));

  if (!category) {
    redirect("/admin/categories");
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
              <Link href="/admin/categories">All Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Edit Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditCategory category={category} />
    </>
  );
};

export default EditCategoryPage;
