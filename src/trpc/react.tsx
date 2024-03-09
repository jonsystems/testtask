"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCClientError, loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { toast } from "@/components/ui/use-toast";
import { type AppRouter } from "@/server/api/root";
import { useRouter } from "next/navigation";
import { getUrl, transformer } from "./shared";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const router = useRouter();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (val, err) => {
          if (typeof window === "undefined") return true;
          if (!(err instanceof TRPCClientError)) return true;
          if (err.data?.code === "UNAUTHORIZED") {
            router.push("/sign-in");
            return false;
          } else {
            toast({
              title: "An error occurred",
              description: err.toString().replaceAll("TRPCClientError: ", ""),
              variant: "destructive"
            })
            return true;
          };
        }
      },
      mutations: {
        retry: (val, err) => {
          if (typeof window === "undefined") return true;
          if (!(err instanceof TRPCClientError)) return true;
          if (err.data?.code === "UNAUTHORIZED") {
            router.push("/sign-in");
            return false;
          } else {
            toast({
              title: "An error occurred",
              description: err.toString().replaceAll("TRPCClientError: ", ""),
              variant: "destructive"
            })
            return true;
          };
        }
      }
    }
  }));

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
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
