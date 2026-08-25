"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  PackagePlus,
  PackageMinus,
  ArrowLeftRight,
  AlertTriangle,
  Activity,
} from "lucide-react";

import {
  useWarehouseStock,
  useInventoryMovements,
} from "@/hooks/use-inventory";

import { useWarehousesList } from "@/hooks/use-locations";

import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { CustomDataTable } from "@/components/shared/data-table";

import { Skeleton, Button, Input } from "@/components/ui";

import { warehouseStockColumns } from "@/components/warehouse/warehouse-stock-columns";

export default function WarehouseDashboard() {
  const [search, setSearch] = useState("");

  const { data: warehouses, isLoading: warehousesLoading } =
    useWarehousesList();

  /*
   * Backend already scopes warehouses for the
   * Warehouse Keeper, so we use the assigned warehouse.
   */
  const warehouse = warehouses?.[0];

  const { data: stockData, isLoading: stockLoading } = useWarehouseStock(
    warehouse?.id,
    search,
    1
  );

  const { data: movementsData, isLoading: movementsLoading } =
    useInventoryMovements({
      page: 1,
    });

  const stock = useMemo(() => stockData?.results ?? [], [stockData?.results]);

  const totalUnits = useMemo(() => {
    return stock.reduce((total, item) => total + Number(item.quantity), 0);
  }, [stock]);

  /*
   * We don't currently have the product's
   * low_stock_threshold inside WarehouseStock.
   *
   * Until the API provides that field, keep
   * the dashboard threshold at 10.
   */
  const lowStockItems = useMemo(() => {
    return stock.filter((item) => Number(item.quantity) <= 10);
  }, [stock]);

  const isLoading = warehousesLoading || stockLoading || movementsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>

        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Warehouse</h1>

        <BorderedLayout>
          <div className="p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />

            <h2 className="mt-3 text-lg font-semibold text-gray-800">
              No warehouse assigned
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              You currently don&apos;t have a warehouse assigned to your account.
            </p>
          </div>
        </BorderedLayout>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{warehouse.name}</h1>

          <p className="text-gray-500 text-sm">
            {warehouse.location ?? "Manage your warehouse inventory"}
          </p>
        </div>

        <Link href="/warehouse/inventory/add">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PackagePlus size={16} className="mr-2" />
            Add Stock
          </Button>
        </Link>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Package} title="Total Units" value={totalUnits} />

        <StatCard
          icon={Activity}
          title="Products in Stock"
          value={stock.length}
        />

        <StatCard
          icon={AlertTriangle}
          title="Low Stock Items"
          value={lowStockItems.length}
        />

        <StatCard
          icon={ArrowLeftRight}
          title="Recent Movements"
          value={movementsData?.results.length ?? 0}
        />
      </div>


      <BorderedLayout>
        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500">
              Manage stock in your warehouse
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/warehouse/inventory/add">
              <Button variant="outline" className="w-full h-12 justify-start">
                <PackagePlus className="h-4 w-4 mr-3 text-emerald-500" />
                Add Stock
              </Button>
            </Link>

            <Link href="/warehouse/inventory/remove">
              <Button variant="outline" className="w-full h-12 justify-start">
                <PackageMinus className="h-4 w-4 mr-3 text-red-500" />
                Remove Stock
              </Button>
            </Link>

            <Link href="/warehouse/inventory/transfer">
              <Button variant="outline" className="w-full h-12 justify-start">
                <ArrowLeftRight className="h-4 w-4 mr-3 text-orange-500" />
                Transfer Stock
              </Button>
            </Link>
          </div>
        </div>
      </BorderedLayout>


      <BorderedLayout>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Current Stock
              </h2>

              <p className="text-sm text-gray-500">
                Products currently available in your warehouse
              </p>
            </div>

            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
          </div>

          <CustomDataTable
            data={stock}
            columns={warehouseStockColumns}
            isFetching={stockLoading}
            getRowId={(row) => String(row.id)}
          />
        </div>
      </BorderedLayout>


      <BorderedLayout>
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock Alerts
          </h2>
        </div>

        <div className="px-6 pb-5">
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">
              Everything&apos;s well stocked.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lowStockItems.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.product_name}
                    </p>

                    <p className="text-xs text-gray-400">{item.product_sku}</p>
                  </div>

                  <span className="text-sm font-semibold text-red-500">
                    {item.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BorderedLayout>


      <BorderedLayout>
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Inventory Activity
          </h2>
        </div>

        <div className="px-6 pb-5">
          {!movementsData?.results?.length ? (
            <p className="text-sm text-gray-400 py-4">
              No inventory movements yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {movementsData.results.slice(0, 5).map((movement) => (
                <li
                  key={movement.id}
                  className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          movement.movement_type === "ADD"
                            ? "text-emerald-600"
                            : movement.movement_type === "REMOVE"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}>
                        {movement.movement_type}
                      </span>

                      <span className="text-sm font-medium text-gray-800">
                        {movement.product_name}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {movement.performed_by_username} •{" "}
                      {new Date(movement.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {movement.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </BorderedLayout>
    </div>
  );
}
