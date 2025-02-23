import { PropsWithChildren, useState } from "react";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
};

const ReactQueryProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(new QueryClient(queryClientConfig));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
