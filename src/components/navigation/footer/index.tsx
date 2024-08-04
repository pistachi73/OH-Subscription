import { api } from "@/trpc/server";

import { FooterContent } from "./footer-content";

export const Footer = async () => {
  const categories = await api.category.getAll.query();

  return <FooterContent categories={categories} />;
};
