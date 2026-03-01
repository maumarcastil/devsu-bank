import { apiClient } from '../api/client';
import { Product, ProductsResponse } from './types';

export const productsService = {
  getAll: async (): Promise<ProductsResponse> => {
    return apiClient.get<ProductsResponse>('/bp/products');
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/bp/products/${id}`);
  },

  create: async (product: Product): Promise<{ data: Product }> => {
    return apiClient.post<{ data: Product }>('/bp/products', product);
  },

  verifyId: async (id: string): Promise<{ data: boolean }> => {
    return apiClient.get<{ data: boolean }>(`/bp/products/verification/${id}`);
  },

  update: async (id: string, product: Product): Promise<{ data: Product }> => {
    return apiClient.put<{ data: Product }>(`/bp/products/${id}`, product);
  },

  delete: async (id: string): Promise<{ data: boolean }> => {
    return apiClient.delete<{ data: boolean }>(`/bp/products/${id}`);
  },
};
