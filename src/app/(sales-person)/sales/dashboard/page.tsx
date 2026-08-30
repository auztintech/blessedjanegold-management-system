"use client";

import { Boxes, Package, ShoppingCart, Store, TrendingUp } from "lucide-react";

import { useSalesDashboard } from "@/hooks/use-sales-dashboard";

import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Skeleton } from "@/components/ui/skeleton";

import { SalesPersonSalesTrendChart } from "@/components/dashboard/sales-person/sales-person-sales-trend-chart";
import { SalesPersonSalesByShopChart } from "@/components/dashboard/sales-person/sales-person-sales-by-shop-chart";
import { SalesPersonPaymentMethodChart } from "@/components/dashboard/sales-person/sales-person-payment-method-chart";
import { SalesPersonTopProductsChart } from "@/components/dashboard/sales-person/sales-person-top-products-chart";

import { SalesPersonRecentSales } from "@/components/dashboard/sales-person/sales-person-recent-sales";
import { SalesPersonLowStock } from "@/components/dashboard/sales-person/sales-person-low-stock";

export default function SalesDashboardPage() {
  const { data, isLoading, isError } = useSalesDashboard();

  if (isLoading) {
    return <SalesDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Failed to load sales dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 overflow-hidden">
      {/* Header */}
      <section>
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Sales Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your sales performance, shops and inventory.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Store}
            title="Assigned Shops"
            value={data.assigned_shops.length}
          />

          <StatCard
            icon={Boxes}
            title="Inventory Units"
            value={data.total_inventory_in_my_shops}
          />

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

      {/* Assigned Shops */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">My Shops</h2>

            <p className="mt-1 text-sm text-gray-500">
              Shops currently assigned to you.
            </p>
          </div>

          {data.assigned_shops.length === 0 ? (
            <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-sm text-gray-400">No shops assigned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.assigned_shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Store className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {shop.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Shop #{shop.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BorderedLayout>

      {/* Sales Trend */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Sales Trend</h2>

            <p className="mt-1 text-sm text-gray-500">
              Your revenue and sales activity over time.
            </p>
          </div>

          <SalesPersonSalesTrendChart data={data.sales_trend} />
        </div>
      </BorderedLayout>

      {/* Shop + Payment */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Sales by Shop
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Compare your sales performance across assigned shops.
              </p>
            </div>

            <SalesPersonSalesByShopChart data={data.sales_by_shop} />
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

            <SalesPersonPaymentMethodChart
              data={data.sales_by_payment_method}
            />
          </div>
        </BorderedLayout>
      </div>

      {/* Top Products */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Top-Selling Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products with the highest sales volume.
            </p>
          </div>

          <SalesPersonTopProductsChart data={data.top_products} />
        </div>
      </BorderedLayout>

      {/* Recent Sales */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Sales
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest sales transactions from your assigned shops.
            </p>
          </div>

          <SalesPersonRecentSales data={data.recent_sales} />
        </div>
      </BorderedLayout>

      {/* Low Stock */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products in your shops that require inventory attention.
            </p>
          </div>

          <SalesPersonLowStock data={data.low_stock_products} />
        </div>
      </BorderedLayout>
    </div>
  );
}

function SalesDashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>

      {/* Shops */}
      <Skeleton className="h-40 w-full rounded-lg" />

      {/* Sales Trend */}
      <Skeleton className="h-105 w-full rounded-lg" />

      {/* Shop + Payment */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-95 w-full rounded-lg" />
        <Skeleton className="h-95 w-full rounded-lg" />
      </div>

      {/* Products */}
      <Skeleton className="h-105 w-full rounded-lg" />

      {/* Recent Sales */}
      <Skeleton className="h-87.5 w-full rounded-lg" />

      {/* Low Stock */}
      <Skeleton className="h-75 w-full rounded-lg" />
    </div>
  );
}
