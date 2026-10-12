import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, unwrap } from '@/shared/api/client';
import type { RequestBody, ResponseBody } from '@/shared/api/types';

export type Item = ResponseBody<'/api/items', 'get'>[number];
export type CreateItemInput = RequestBody<'/api/items', 'post'>;

const itemsKey = ['items'] as const;

export function useItems() {
  return useQuery({
    queryKey: itemsKey,
    queryFn: () => unwrap(api.GET('/api/items')),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItemInput) =>
      unwrap(api.POST('/api/items', { body })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: Item['id']) =>
      unwrap(api.DELETE('/api/items/{id}', { params: { path: { id } } })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey }),
  });
}
