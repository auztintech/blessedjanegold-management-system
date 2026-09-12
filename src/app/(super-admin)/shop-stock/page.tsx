"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useShopStock } from "@/hooks/use-inventory";
import { useShopsList } from "@/hooks/use-locations";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { ShopStock } from "@/types/inventory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<ShopStock, any>[] = [
  { accessorKey: "product_name", header: "Product" },
  { accessorKey: "product_sku", header: "SKU" },
  { accessorKey: "quantity", header: "Quantity" },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

export default function ShopStockPage() {
  const { data: shops } = useShopsList();
  const [shopId, setShopId] = useState<number | undefined>();

  const { data: stock, isLoading } = useShopStock(shopId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shop Stock</h1>
        <p className="text-gray-500 text-sm">
          View current stock levels for any shop
        </p>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="max-w-xs mb-4 space-y-1.5">
            <Select
              value={shopId ? String(shopId) : ""}
              onValueChange={(val) => setShopId(Number(val))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a shop">
                  {shops?.find((s) => s.id === shopId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {shops?.map((shop) => (
                  <SelectItem key={shop.id} value={String(shop.id)}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!shopId ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              Select a shop to view its stock.
            </p>
          ) : (
            <CustomDataTable
              data={stock ?? []}
              columns={columns}
              isFetching={isLoading}
              getRowId={(row: ShopStock) => String(row.id)}
            />
          )}
        </div>
      </BorderedLayout>
    </div>
  );
}
