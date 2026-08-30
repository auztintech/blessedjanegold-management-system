"use client";

import {
  Boxes,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
} from "lucide-react";

import { useWarehouseDashboard } from "@/hooks/use-warehouse-dashboard";

import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { Skeleton } from "@/components/ui/skeleton";

import { WarehouseInventoryValuationChart } from "@/components/warehouse/warehouse-inventory-valuation-chart";
import { WarehouseActivityChart } from "@/components/warehouse/warehouse-activity-chart";
import { WarehouseMovementChart } from "@/components/warehouse/warehouse-movement-chart";

import { WarehouseLowStock } from "@/components/warehouse/warehouse-low-stock";
import { WarehouseStockAdditions } from "@/components/warehouse/warehouse-stock-additions";
import { WarehouseStockRemovals } from "@/components/warehouse/warehouse-stock-removals";
import { WarehouseTransfers } from "@/components/warehouse/warehouse-transfers";

export default function WarehouseDashboardPage() {
  const { data, isLoading, isError } = useWarehouseDashboard();

  if (isLoading) {
    return <WarehouseDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Failed to load warehouse dashboard data.
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
            Warehouse Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your assigned warehouses, inventory and stock activity.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Warehouse}
            title="Assigned Warehouses"
            value={data.assigned_warehouses.length}
          />

          <StatCard
            icon={Boxes}
            title="Inventory Units"
            value={data.total_inventory_in_my_warehouses}
          />

          <StatCard
            icon={ArrowDownToLine}
            title="Stock Additions"
            value={data.recent_stock_additions.length}
            unit="recent"
          />

          <StatCard
            icon={ArrowUpFromLine}
            title="Stock Removals"
            value={data.recent_stock_removals.length}
            unit="recent"
          />

          <StatCard
            icon={ArrowLeftRight}
            title="Recent Transfers"
            value={data.recent_transfers.length}
            unit="recent"
          />
        </div>
      </section>

      {/* Assigned Warehouses */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              My Warehouses
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Warehouses currently assigned to you.
            </p>
          </div>

          {data.assigned_warehouses.length === 0 ? (
            <div className="flex min-h-30 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-sm text-gray-400">No warehouses assigned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.assigned_warehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Warehouse className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {warehouse.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Warehouse #{warehouse.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BorderedLayout>

      {/* Inventory Valuation */}
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

          <WarehouseInventoryValuationChart data={data.inventory_valuation} />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ValuationCard
              label="Warehouse Value"
              value={data.inventory_valuation.warehouse_value}
            />

            <ValuationCard
              label="Shop Value"
              value={data.inventory_valuation.shop_value}
            />

            <ValuationCard
              label="Total Value"
              value={data.inventory_valuation.total_value}
            />
          </div>
        </div>
      </BorderedLayout>

      {/* Warehouse Activity + Movement */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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

        <BorderedLayout>
          <div className="p-4 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Movement Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Movement types recorded during the last 30 days.
              </p>
            </div>

            <WarehouseMovementChart data={data.movement_counts_last_30_days} />
          </div>
        </BorderedLayout>
      </div>

      {/* Low Stock */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products in your warehouses that require inventory attention.
            </p>
          </div>

          <WarehouseLowStock data={data.low_stock_products} />
        </div>
      </BorderedLayout>

      {/* Stock Additions */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Stock Additions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest inventory added to your warehouses.
            </p>
          </div>

          <WarehouseStockAdditions data={data.recent_stock_additions} />
        </div>
      </BorderedLayout>

      {/* Stock Removals */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Stock Removals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest inventory removed from your warehouses.
            </p>
          </div>

          <WarehouseStockRemovals data={data.recent_stock_removals} />
        </div>
      </BorderedLayout>

      {/* Transfers */}
      <BorderedLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transfers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest stock transfers involving your warehouses.
            </p>
          </div>

          <WarehouseTransfers data={data.recent_transfers} />
        </div>
      </BorderedLayout>
    </div>
  );
}

function ValuationCard({ label, value }: { label: string; value: string }) {
  const amount = Number(value) || 0;

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-gray-900">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function WarehouseDashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-40 w-full rounded-lg" />

      <Skeleton className="h-105 w-full rounded-lg" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-95 w-full rounded-lg" />
        <Skeleton className="h-95 w-full rounded-lg" />
      </div>

      <Skeleton className="h-75 w-full rounded-lg" />

      <Skeleton className="h-87.5 w-full rounded-lg" />

      <Skeleton className="h-87.5 w-full rounded-lg" />

      <Skeleton className="h-87.5 w-full rounded-lg" />
    </div>
  );
}
