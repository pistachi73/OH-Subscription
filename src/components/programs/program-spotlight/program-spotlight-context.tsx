"use client";

import createSharedDataContext from "@/components/shared-data-context";
import type { ProgramSpotlight } from "@/types";

const [ProgramSpotlightContextProvider, useProgramSpotlightContext] =
  createSharedDataContext<NonNullable<ProgramSpotlight>>();

export { ProgramSpotlightContextProvider, useProgramSpotlightContext };
