"use client";

import { useState } from "react";
import { useSales } from "@/hooks/use-sales";
import { CustomDataTable } from "@/components/shared/data-table";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { formatMNumber } from "@/lib/currency";
import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/types/sales";
import { Button } from "@/components/ui";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<Sale, any>[] = [
  { accessorKey: "transaction_number", header: "Transaction #" },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  { accessorKey: "payment_method", header: "Payment" },
  {
    id: "item_count",
    header: "Items",
    cell: ({ row }) => `${row.original.items.length} item(s)`,
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatMNumber(Number(row.original.total_amount))}
      </span>
    ),
  },
];

export default function SalesHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSales({ page });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
        <p className="text-gray-500 text-sm">Your past sales transactions</p>
      </div>

      <BorderedLayout>
        <div className="p-4">
          <CustomDataTable
            data={data?.results ?? []}
            columns={columns}
            isFetching={isLoading}
            getRowId={(row: Sale) => String(row.id)}
          />
        </div>
      </BorderedLayout>

      {data && data.count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{data.count} total sales</span>
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
