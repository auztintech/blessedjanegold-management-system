"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import { Sale, CreateSalePayload } from "@/types/sales";

interface SalesFilters {
  page?: number;
  shop?: number;
  payment_method?: string;
  search?: string;
}

export function useSales(filters: SalesFilters = {}) {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<Sale>>(
        endpoints().sales.list,
        {
          params: filters,
        }
      );
      return data;
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      const { data } = await instance.post<Sale>(
        endpoints().sales.list,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["shop-stock"] }); // stock drops after a sale
      toast.success("Sale recorded successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) => {
      const data = error?.response?.data;
      const firstError = data ? Object.values(data)[0] : null;
      const message = Array.isArray(firstError)
        ? firstError[0]
        : firstError || "Failed to record sale";
      toast.error(message as string);
    },
  });
}
