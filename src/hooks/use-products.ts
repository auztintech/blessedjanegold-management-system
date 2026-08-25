"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Product, ProductPayload } from "@/types/inventory";

export function useProducts(
  filters: { category?: number; is_active?: boolean } = {}
) {
  return useQuery({
    queryKey: ["products-list", filters],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<Product>>(
        endpoints().inventory.products,
        {
          params: filters,
        }
      );
      return data.results;
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

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await instance.post<Product>(
        endpoints().inventory.products,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: ProductPayload;
    }) => {
      const { data } = await instance.patch<Product>(
        endpoints(id).inventory.productDetail,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).inventory.productDetail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product removed");
    },
    onError: () => toast.error("Failed to remove product"),
  });
}
