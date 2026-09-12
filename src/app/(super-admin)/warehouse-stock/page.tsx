"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@/components/ui";
import { useWarehouseStock } from "@/hooks/use-inventory";
import { useWarehousesList } from "@/hooks/use-locations";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { WarehouseStock } from "@/types/inventory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<WarehouseStock, any>[] = [
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

export default function WarehouseStockPage() {
  const { data: warehouses } = useWarehousesList();
  const [warehouseId, setWarehouseId] = useState<number | undefined>();
  const [search] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useWarehouseStock(warehouseId, search, page);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Stock</h1>
        <p className="text-gray-500 text-sm">
          View current stock levels for any warehouse
        </p>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="max-w-xs w-full space-y-1.5">
              <Select
                value={warehouseId ? String(warehouseId) : ""}
                onValueChange={(val) => {
                  setWarehouseId(Number(val));
                  setPage(1);
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a warehouse">
                    {warehouses?.find((w) => w.id === warehouseId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map((wh) => (
                    <SelectItem key={wh.id} value={String(wh.id)}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!warehouseId ? (
            <p className="text-sm text-gray-400 py-8 text-center">
              Select a warehouse to view its stock.
            </p>
          ) : (
            <CustomDataTable
              data={data?.results ?? []}
              columns={columns}
              isFetching={isLoading}
              getRowId={(row: WarehouseStock) => String(row.id)}
            />
          )}
        </div>
      </BorderedLayout>

      {warehouseId && data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{data.count} total items</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
