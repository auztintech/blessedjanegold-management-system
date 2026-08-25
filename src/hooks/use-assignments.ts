"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";

export interface ShopAssignment {
  id: number;
  user: number;
  user_username: string;
  shop: number;
  shop_name: string;
  assigned_at: string;
}

export interface WarehouseAssignment {
  id: number;
  user: number;
  user_username: string;
  warehouse: number;
  warehouse_name: string;
  assigned_at: string;
}

export function useShopAssignments(page = 1) {
  return useQuery({
    queryKey: ["shop-assignments", page],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<ShopAssignment>>(
        endpoints().user.shopAssignments,
        { params: { page } }
      );
      return data;
    },
  });
}

export function useWarehouseAssignments(page = 1) {
  return useQuery({
    queryKey: ["warehouse-assignments", page],
    queryFn: async () => {
      const { data } = await instance.get<
        PaginatedResponse<WarehouseAssignment>
      >(endpoints().user.warehouseAssignments, { params: { page } });
      return data;
    },
  });
}

export function useAssignShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { user: number; shop: number }) => {
      const { data } = await instance.post<ShopAssignment>(
        endpoints().user.shopAssignments,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-assignments"] });
    },
  });
}

export function useAssignWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { user: number; warehouse: number }) => {
      const { data } = await instance.post<WarehouseAssignment>(
        endpoints().user.warehouseAssignments,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-assignments"] });
    },
  });
}
