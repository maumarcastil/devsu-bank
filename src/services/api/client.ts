import { QueryClient } from '@tanstack/react-query';
import { Config } from '@/constants/config';

export { Config };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

interface ApiClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data?: unknown) => Promise<T>;
  put: <T>(endpoint: string, data: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

export const apiClient: ApiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
};
