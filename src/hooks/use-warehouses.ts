"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Warehouse, LocationPayload } from "@/types/location";

export function useWarehouses(page = 1, search = "") {
  return useQuery({
    queryKey: ["warehouses", page, search],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<Warehouse>>(
        endpoints().warehouses.list,
        {
          params: { page, search: search || undefined },
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

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LocationPayload) => {
      const { data } = await instance.post<Warehouse>(
        endpoints().warehouses.list,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse created successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to create warehouse"),
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: LocationPayload;
    }) => {
      const { data } = await instance.patch<Warehouse>(
        endpoints(id).warehouses.detail,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse updated successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to update warehouse"),
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).warehouses.detail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse removed");
    },
    onError: () => toast.error("Failed to remove warehouse"),
  });
}
