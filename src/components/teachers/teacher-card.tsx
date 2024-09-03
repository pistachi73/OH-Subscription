import { cn } from "@/lib/utils/cn";
import type { Teacher } from "@/types";
import { m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type TeacherCardProps = {
  teacher: NonNullable<Teacher>;
};

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <m.article
      initial="initial"
      whileHover="hover"
      className="relative h-full w-full z-0 aspect-[6/7]  bg-muted rounded-xl shadow-md  flex-row gap-0 overflow-hidden"
    >
      <Link
        href={`/teachers/${teacher.id}`}
        className="h-full w-full  relative flex items-end"
      >
        <section
          className={cn(" shrink-0 absolute top-0 w-full left-0 z-10 h-full")}
          role="figure"
        >
          <Image
            src={"/images/teacher-test.png"}
            alt="teacher avatar"
            fill
            className="object-cover w-full h-full"
          />
        </section>
        <section
          className={cn(
            "absolute bottom-0 left-0 z-20 p-3 flex flex-col w-full h-auto justify-end",
            "before:absolute before:-z-10 before:left-0 before:bottom-0 before:h-[120%] before:w-full before:bg-gradient-to-t from-muted-background/70 to-background/0 ",
          )}
        >
          <p className="inline text-lg font-semibold tracking-tight">
            {teacher.name}
          </p>
          <p className="inline text-muted-foreground text-sm">Teacher at OH</p>

          <m.div
            key={teacher.name}
            variants={{
              initial: { opacity: 1, height: 0, y: 10 },
              hover: { opacity: 1, height: "auto", y: 0 },
            }}
            transition={{
              type: "spring",
              mass: 1,
              stiffness: 200,
              damping: 20,
            }}
          >
            <span className="mt-2 h-10 w-full flex items-center justify-center rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              See teacher work
            </span>
          </m.div>
        </section>
      </Link>
    </m.article>
  );
};
