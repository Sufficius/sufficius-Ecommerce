import { QueryClient } from '@tanstack/react-query';

let queryClientInstance: QueryClient | null = null;

 const getQueryClient = (): QueryClient => {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient();
  }
  return queryClientInstance;
};

export const queryClient = getQueryClient();