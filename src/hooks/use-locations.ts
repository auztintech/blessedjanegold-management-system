"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";

export interface SimpleLocation {
  id: number;
  name: string;
  location?: string;
  is_active?: boolean;
}

export function useShopsList() {
  return useQuery({
    queryKey: ["shops-list"],

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<SimpleLocation>>(
        endpoints().shops.list
      );

      return data.results;
    },
  });
}

export function useWarehousesList() {
  return useQuery({
    queryKey: ["warehouses-list"],

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<SimpleLocation>>(
        endpoints().warehouses.list
      );

      return data.results;
    },
  });
}
