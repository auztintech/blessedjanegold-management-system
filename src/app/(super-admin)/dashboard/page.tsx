"use client";

import {
  Boxes,
  Package,
  ShoppingCart,
  Store,
  TrendingUp,
  Warehouse,
} from "lucide-react";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Skeleton } from "@/components/ui/skeleton";

import { SalesTrendChart } from "@/components/dashboard/sales-trend-chart";
import { SalesByShopChart } from "@/components/dashboard/sales-by-shop-chart";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { PaymentMethodChart } from "@/components/dashboard/payment-method-chart";
import { InventoryValuationChart } from "@/components/dashboard/inventory-valuation-chart";
import { WarehouseActivityChart } from "@/components/dashboard/warehouse-activity-chart";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 overflow-hidden">
      <section>
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your business performance, sales and inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Store}
            title="Total Shops"
            value={data.overview.total_shops}
          />

          <StatCard
            icon={Warehouse}
            title="Total Warehouses"
            value={data.overview.total_warehouses}
          />

          <StatCard
            icon={Package}
            title="Total Products"
            value={data.overview.total_products}
          />

          <StatCard
            icon={Boxes}
            title="Inventory Units"
            value={data.overview.total_inventory_units}
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Sales Performance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current and historical sales performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={ShoppingCart}
            title="Today's Sales"
            value={data.sales_summary.today_count}
            unit="orders"
          />

          <StatCard
            icon={TrendingUp}
            title="Today's Revenue"
            value={data.sales_summary.today_total}
            money
          />

          <StatCard
            icon={ShoppingCart}
            title="All-Time Sales"
            value={data.sales_summary.all_time_count}
            unit="orders"
          />

          <StatCard
            icon={TrendingUp}
            title="All-Time Revenue"
            value={data.sales_summary.all_time_total}
            money
          />
          <StatCard
            icon={Package}
            title="Average Sale Value"
            value={data.sales_summary.average_sale_value}
            money
          />
        </div>
      </section>

      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>

            <p className="mt-1 text-sm text-gray-500">
              Revenue and sales activity over time.
            </p>
          </div>

          <SalesTrendChart data={data.sales_trend} />
        </div>
      </BorderedLayout>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Sales by Shop
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare revenue generated across shops.
              </p>
            </div>

            <SalesByShopChart data={data.sales_by_shop} />
          </div>
        </BorderedLayout>

        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Methods
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Revenue distribution by payment method.
              </p>
            </div>

            <PaymentMethodChart data={data.sales_by_payment_method} />
          </div>
        </BorderedLayout>
      </div>

      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Top-Selling Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products with the highest sales volume and revenue.
            </p>
          </div>

          <TopProductsChart data={data.top_products} />
        </div>
      </BorderedLayout>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory Valuation
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current inventory value across warehouses and shops.
              </p>
            </div>

            <InventoryValuationChart data={data.inventory_valuation} />
          </div>
        </BorderedLayout>

        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Warehouse Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Stock movement activity during the last 30 days.
              </p>
            </div>

            <WarehouseActivityChart data={data.warehouse_activity} />
          </div>
        </BorderedLayout>
      </div>

      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest sales transactions across all shops.
            </p>
          </div>

          {data.recent_sales.length === 0 ? (
            <EmptyState message="No recent sales yet." />
          ) : (
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

                    <th className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Customer Name
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
                  {data.recent_sales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="transition-colors hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900">
                        {sale.transaction_number}
                      </td>

                      <td className="px-3 py-3 text-gray-600">
                        {sale.shop__name}
                      </td>

                      <td className="px-3 py-3 text-gray-600">
                        {sale.sales_person__username}
                      </td>

                      <td className="px-3 py-3 text-gray-600">
                        {sale.customer_name}
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
          )}
        </div>
      </BorderedLayout>

      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products that require inventory attention.
            </p>
          </div>

          {data.low_stock_products.length === 0 ? (
            <EmptyState message="No low-stock alerts right now." />
          ) : (
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
                  {data.low_stock_products.map((product) => {
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

                        <td className="px-3 py-3 text-gray-500">
                          {product.sku}
                        </td>

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
          )}
        </div>
      </BorderedLayout>

      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Movement Summary
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Inventory movements recorded during the last 30 days.
            </p>
          </div>

          {data.movement_counts_last_30_days.length === 0 ? (
            <EmptyState message="No stock movements recorded." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.movement_counts_last_30_days.map((movement) => (
                <div
                  key={movement.movement_type}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {movement.movement_type}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {movement.count.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">Last 30 days</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </BorderedLayout>
    </div>
  );
}

function formatCurrency(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50 px-4">
      <p className="text-center text-sm text-gray-400">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-105 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-95 w-full rounded-lg" />
        <Skeleton className="h-95 w-full rounded-lg" />
      </div>

      <Skeleton className="h-105 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-95 w-full rounded-lg" />
        <Skeleton className="h-95 w-full rounded-lg" />
      </div>

      <Skeleton className="h-87.5 w-full rounded-lg" />

      <Skeleton className="h-75 w-full rounded-lg" />

      <Skeleton className="h-62.5 w-full rounded-lg" />
    </div>
  );
}
