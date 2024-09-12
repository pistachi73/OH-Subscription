import type { CustomErrorShape } from "@/server/api/trpc";
import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import superjson from "superjson";

const onError = (error: unknown, ...args: any[]) => {
  const customError = error as CustomErrorShape;
  const { zodError } = customError.data ?? {};

  switch (true) {
    case Boolean(zodError): {
      let errorString = "";

      for (const [key, value] of Object.entries(zodError?.fieldErrors ?? {})) {
        errorString += `${value
          ?.map((v) => {
            if (typeof v === "string") return v;
            return null;
          })
          .filter(Boolean)
          .join(", ")}, `;
      }

      for (const error of zodError?.formErrors ?? []) {
        errorString += `${error}, `;
      }

      toast.error(errorString.slice(0, -2));
      break;
    }
    case Boolean(customError.message):
      toast.error(customError.message);
      break;
    default:
      toast.error("Something went wrong, please try again later.");
  }
};

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
