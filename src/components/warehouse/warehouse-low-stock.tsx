"use client";

import type { WarehouseLowStockProduct } from "@/types/dashboard";

interface WarehouseLowStockProps {
  data: WarehouseLowStockProduct[];
}

export function WarehouseLowStock({ data }: WarehouseLowStockProps) {
  if (!data.length) {
    return (
      <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50 px-4">
        <p className="text-center text-sm text-gray-400">
          No low-stock alerts right now.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-162.5 text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Product
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              SKU
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Stock
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Threshold
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((product) => {
            const isCritical =
              product.total_quantity <=
              Math.max(1, Math.floor(product.low_stock_threshold / 2));

            return (
              <tr
                key={product.id}
                className="transition-colors hover:bg-gray-50">
                <td className="px-3 py-3 font-medium text-gray-900">
                  {product.name}
                </td>

                <td className="px-3 py-3 text-gray-500">{product.sku}</td>

                <td className="px-3 py-3 text-right font-semibold text-red-500">
                  {product.total_quantity}
                </td>

                <td className="px-3 py-3 text-right text-gray-600">
                  {product.low_stock_threshold}
                </td>

                <td className="px-3 py-3 text-right">
                  <span
                    className={
                      isCritical
                        ? "inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600"
                        : "inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600"
                    }>
                    {isCritical ? "Critical" : "Low Stock"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
