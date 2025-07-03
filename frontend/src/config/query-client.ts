import { type DefaultOptions, QueryClient } from "@tanstack/react-query"

const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: 3,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
})
