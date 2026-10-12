import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
    },
    // Every failed mutation shows a toast, so components only handle success
    mutationCache: new MutationCache({
      onError: (error) => toast.error(error.message),
    }),
  });
}
