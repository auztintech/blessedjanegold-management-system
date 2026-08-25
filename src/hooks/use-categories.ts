"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import {
  Category,
  CategoryPayload,
  CategoryListParams,
} from "@/types/inventory";

export function useCategories(params: CategoryListParams = {}) {
  return useQuery({
    queryKey: ["categories", params],

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<Category>>(
        endpoints().inventory.categories,
        {
          params: {
            ...params,
            search: params.search || undefined,
          },
        }
      );

      return data;
    },
  });
}

function handleMutationError(
  error: AxiosError<Record<string, string[] | string>>,
  fallback: string
) {
  const data = error?.response?.data;

  const firstError = data ? Object.values(data)[0] : null;

  const message = Array.isArray(firstError)
    ? firstError[0]
    : firstError || fallback;

  toast.error(message as string);
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await instance.post<Category>(
        endpoints().inventory.categories,
        payload
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success("Category created successfully");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: CategoryPayload;
    }) => {
      const { data } = await instance.patch<Category>(
        endpoints(id).inventory.categoryDetail,
        payload
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      // Also refresh products because product category names can depend
      // on category data.
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Category updated successfully");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).inventory.categoryDetail);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Category removed");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to remove category"),
  });
}
