"use client";

import type { WarehouseTransfer } from "@/types/dashboard";

interface WarehouseTransfersProps {
  data: WarehouseTransfer[];
}

export function WarehouseTransfers({ data }: WarehouseTransfersProps) {
  if (!data.length) {
    return (
      <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50 px-4">
        <p className="text-sm text-gray-400">No recent transfers.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175 text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Product
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Quantity
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              From
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              To Warehouse
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              To Shop
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-gray-50">
              <td className="px-3 py-3 font-medium text-gray-900">
                {item.product__name}
              </td>

              <td className="px-3 py-3 text-right font-semibold text-blue-600">
                {item.quantity.toLocaleString("en-NG")}
              </td>

              <td className="px-3 py-3 text-gray-600">
                {item.from_warehouse__name || "—"}
              </td>

              <td className="px-3 py-3 text-gray-600">
                {item.to_warehouse__name || "—"}
              </td>

              <td className="px-3 py-3 text-gray-600">
                {item.to_shop__name || "—"}
              </td>

              <td className="px-3 py-3 text-right text-gray-500">
                {formatDate(item.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
