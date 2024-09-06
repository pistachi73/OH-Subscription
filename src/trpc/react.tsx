"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { getUrl, transformer } from "./shared";

import type { AppRouter } from "@/server/api/root";
import type { CustomErrorShape } from "@/server/api/trpc";
import { toast } from "sonner";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  cookies: string;
  authorization: string;
}) {
  const onError = (error: unknown, ...args: any[]) => {
    const customError = error as CustomErrorShape;
    const { zodError, cause } = customError.data;

    switch (true) {
      case Boolean(zodError): {
        let errorString = "";

        for (const [key, value] of Object.entries(
          zodError?.fieldErrors ?? {},
        )) {
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
      case Boolean(cause):
        toast.error(cause);
        break;
      default:
        toast.error("Something went wrong, please try again later.");
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError,
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            return {
              cookie: props.cookies,
              "x-trpc-source": "react",
              authorization: props.authorization,
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
