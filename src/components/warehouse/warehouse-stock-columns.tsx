"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WarehouseStock } from "@/types/inventory";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warehouseStockColumns: ColumnDef<WarehouseStock, any>[] = [
  {
    accessorKey: "product_name",
    header: "Product",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-900">{row.original.product_name}</p>

        <p className="text-xs text-gray-400">{row.original.product_sku}</p>
      </div>
    ),
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.original.quantity;

      return (
        <span
          className={
            quantity === 0
              ? "font-semibold text-red-500"
              : quantity <= 10
              ? "font-semibold text-orange-500"
              : "font-semibold text-gray-900"
          }>
          {quantity}
        </span>
      );
    },
  },

  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
  },

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
