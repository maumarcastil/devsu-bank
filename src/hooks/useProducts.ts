import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { productsService } from '@/services/products/products';
import { Product } from '@/services/products/types';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: () => [...PRODUCT_KEYS.all, 'list'] as const,
  detail: (id: string) => [...PRODUCT_KEYS.all, 'detail', id] as const,
};

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(),
    queryFn: productsService.getAll,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => productsService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Product }) =>
      productsService.update(id, product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list() });
    },
  });
};
