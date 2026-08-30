"use client";

import type { SalesPersonRecentSale } from "@/types/dashboard";

interface SalesPersonRecentSalesProps {
  data: SalesPersonRecentSale[];
}

export function SalesPersonRecentSales({ data }: SalesPersonRecentSalesProps) {
  if (!data.length) {
    return (
      <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50 px-4">
        <p className="text-sm text-gray-400">No recent sales yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175 text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Transaction
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Shop
            </th>

            <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Sales Person
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Amount
            </th>

            <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
              Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((sale) => (
            <tr key={sale.id} className="transition-colors hover:bg-gray-50">
              <td className="px-3 py-3 font-medium text-gray-900">
                {sale.transaction_number}
              </td>

              <td className="px-3 py-3 text-gray-600">{sale.shop__name}</td>

              <td className="px-3 py-3 text-gray-600">
                {sale.sales_person__username}
              </td>

              <td className="px-3 py-3 text-right font-medium text-gray-900">
                {formatCurrency(sale.total_amount)}
              </td>

              <td className="px-3 py-3 text-right text-gray-500">
                {formatDate(sale.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(value: string | number) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
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
