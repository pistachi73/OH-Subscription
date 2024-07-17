import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MaxWidthWrapper className="relative z-10 mb-6 sm:mb-8 mt-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tighter">
          Find the perfect programs
        </h1>
        <h2 className="mt-1 text-muted-foreground text-lg ">
          Refine your search and find the perfect prgram.
        </h2>
      </MaxWidthWrapper>
      {children}
    </>
  );
}
