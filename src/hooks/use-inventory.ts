"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";

import {
  Product,
  ShopStock,
  WarehouseStock,
  InventoryMovement,
  AddStockPayload,
  RemoveStockPayload,
  TransferStockPayload,
} from "@/types/inventory";

/* =========================================================
   PRODUCTS
========================================================= */

export function useProducts(
  filters: {
    category?: number;
    is_active?: boolean;
  } = {}
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

/* =========================================================
   SHOP STOCK
========================================================= */

export function useShopStock(shopId?: number) {
  return useQuery({
    queryKey: ["shop-stock", shopId],

    enabled: !!shopId,

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<ShopStock>>(
        endpoints().inventory.shopStock,
        {
          params: {
            shop: shopId,
          },
        }
      );

      return data.results;
    },
  });
}

/* =========================================================
   WAREHOUSE STOCK
========================================================= */

export function useWarehouseStock(warehouseId?: number, search = "", page = 1) {
  return useQuery({
    queryKey: ["warehouse-stock", warehouseId, search, page],

    enabled: !!warehouseId,

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<WarehouseStock>>(
        endpoints().inventory.warehouseStock,
        {
          params: {
            warehouse: warehouseId,
            search: search || undefined,
            page,
          },
        }
      );

      return data;
    },
  });
}

/* =========================================================
   INVENTORY MOVEMENTS
========================================================= */

export interface MovementFilters {
  page?: number;
  product?: number;
  movement_type?: string;
  search?: string;
}

export function useMovements(filters: MovementFilters = {}) {
  return useQuery({
    queryKey: ["inventory-movements", filters],

    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<InventoryMovement>>(
        endpoints().inventory.movements,
        {
          params: filters,
        }
      );

      return data;
    },
  });
}

/*
 * Alias used by the warehouse pages.
 *
 * This means both work:
 *
 * useMovements()
 * useInventoryMovements()
 */

export function useInventoryMovements(filters: MovementFilters = {}) {
  return useMovements(filters);
}

/* =========================================================
   MUTATION ERROR HANDLER
========================================================= */

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

/* =========================================================
   ADD STOCK
========================================================= */

export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddStockPayload) => {
      const { data } = await instance.post<InventoryMovement>(
        endpoints().inventory.addStock,
        payload
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-movements"],
      });

      toast.success("Stock added successfully");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to add stock"),
  });
}

/* =========================================================
   REMOVE STOCK
========================================================= */

export function useRemoveStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveStockPayload) => {
      const { data } = await instance.post<InventoryMovement>(
        endpoints().inventory.removeStock,
        payload
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-movements"],
      });

      toast.success("Stock removed successfully");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to remove stock"),
  });
}

/* =========================================================
   TRANSFER STOCK
========================================================= */

export function useTransferStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TransferStockPayload) => {
      const { data } = await instance.post<InventoryMovement>(
        endpoints().inventory.transferStock,
        payload
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shop-stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-movements"],
      });

      toast.success("Stock transferred successfully");
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) =>
      handleMutationError(error, "Failed to transfer stock"),
  });
}
