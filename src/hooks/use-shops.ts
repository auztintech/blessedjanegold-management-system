"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Shop, LocationPayload } from "@/types/location";

export function useShops(page = 1, search = "") {
  return useQuery({
    queryKey: ["shops", page, search],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<Shop>>(
        endpoints().shops.list,
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

export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LocationPayload) => {
      const { data } = await instance.post<Shop>(
        endpoints().shops.list,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop created successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to create shop"),
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: LocationPayload;
    }) => {
      const { data } = await instance.patch<Shop>(
        endpoints(id).shops.detail,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop updated successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to update shop"),
  });
}

export function useDeleteShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).shops.detail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop removed");
    },
    onError: () => toast.error("Failed to remove shop"),
  });
}
