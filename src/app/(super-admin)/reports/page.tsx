"use client";

import { useState } from "react";
import { FileDown, Printer, RefreshCw } from "lucide-react";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  useReportSummary,
  exportReport,
  ReportFilters,
} from "@/hooks/use-reports";
import { useShopsList, useWarehousesList } from "@/hooks/use-locations";
import { StatCard } from "@/components/dashboard/stat-card";
import { BorderedLayout } from "@/components/shared/bordered-layout";
import { ReportTable } from "@/components/reports/report-table";
import { Skeleton } from "@/components/ui";
import { formatMNumber } from "@/lib/currency";
import {
  ShoppingCart,
  TrendingUp,
  Boxes,
  Package,
  Warehouse,
  Store,
} from "lucide-react";
import { DatePicker } from "@/components/shared/date-picker";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  const { data, isLoading, isFetching, refetch } = useReportSummary(filters);
  const { data: shops } = useShopsList();
  const { data: warehouses } = useWarehousesList();

  const handleExport = async (format: "csv" | "pdf") => {
    setExporting(format);
    try {
      await exportReport(filters, format);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm">
          Business summary over a selected period
        </p>
      </div>

      {/* Filters */}
      <BorderedLayout>
        <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">From</Label>
              <DatePicker
                value={filters.date_from}
                onChange={(val) =>
                  setFilters((f) => ({ ...f, date_from: val }))
                }
                placeholder="Start date"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To</Label>
              <DatePicker
                value={filters.date_to}
                onChange={(val) => setFilters((f) => ({ ...f, date_to: val }))}
                placeholder="End date"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Shop</Label>
              <Select
                value={filters.shop ? String(filters.shop) : "all"}
                onValueChange={(val) =>
                  setFilters((f) => ({
                    ...f,
                    shop: val === "all" ? undefined : Number(val),
                  }))
                }>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {filters.shop
                      ? shops?.find((s) => s.id === filters.shop)?.name
                      : "All Shops"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shops</SelectItem>
                  {shops?.map((shop) => (
                    <SelectItem key={shop.id} value={String(shop.id)}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Warehouse</Label>
              <Select
                value={filters.warehouse ? String(filters.warehouse) : "all"}
                onValueChange={(val) =>
                  setFilters((f) => ({
                    ...f,
                    warehouse: val === "all" ? undefined : Number(val),
                  }))
                }>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {filters.warehouse
                      ? warehouses?.find((w) => w.id === filters.warehouse)
                          ?.name
                      : "All Warehouses"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses?.map((wh) => (
                    <SelectItem key={wh.id} value={String(wh.id)}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="h-10"
              disabled={isFetching}>
              <RefreshCw
                size={14}
                className={`${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="h-10"
              disabled={exporting !== null}>
              <FileDown size={14} className="mr-2" />
              {exporting === "csv" ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="h-10 bg-orange-500 hover:bg-orange-600 text-white">
              <Printer size={14} className="mr-2" />
              {exporting === "pdf" ? "Preparing..." : "Print PDF"}
            </Button>
          </div>
        </div>
      </BorderedLayout>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : data ? (
        <>
          <p className="text-sm text-gray-500">
            Showing data for{" "}
            <span className="font-medium text-gray-700">
              {data.period.date_from}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-700">
              {data.period.date_to}
            </span>
          </p>

          {/* Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={ShoppingCart}
              title="Total Sales"
              value={data.totals.total_sales_count}
            />
            <StatCard
              icon={TrendingUp}
              title="Total Revenue"
              value={Number(data.totals.total_sales_amount)}
              money
            />
            <StatCard
              icon={Package}
              title="Products Sold"
              value={data.totals.distinct_products_sold}
            />
            <StatCard
              icon={Store}
              title="Shops with Sales"
              value={data.totals.shops_with_sales}
            />
            <StatCard
              icon={Boxes}
              title="Stock Added"
              value={data.totals.total_stock_added}
            />
            <StatCard
              icon={Boxes}
              title="Stock Removed"
              value={data.totals.total_stock_removed}
            />
            <StatCard
              icon={Boxes}
              title="Stock Transferred"
              value={data.totals.total_stock_transferred}
            />
            <StatCard
              icon={Warehouse}
              title="Active Warehouses"
              value={data.totals.warehouses_with_activity}
            />
          </div>

          {/* Inventory valuation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Warehouse}
              title="Warehouse Value"
              value={Number(data.inventory_valuation.warehouse_value)}
              money
            />
            <StatCard
              icon={Store}
              title="Shop Value"
              value={Number(data.inventory_valuation.shop_value)}
              money
            />
            <StatCard
              icon={TrendingUp}
              title="Total Inventory Value"
              value={Number(data.inventory_valuation.total_value)}
              money
            />
          </div>

          <ReportTable
            title="Daily Sales Trend"
            data={data.daily_sales_trend}
            columns={[
              { label: "Date", accessor: "date" },
              { label: "Sales Count", accessor: "sale_count" },
              {
                label: "Total Amount",
                accessor: "total_amount",
                format: (v) => formatMNumber(Number(v)),
              },
            ]}
          />

          <ReportTable
            title="Sales by Shop"
            data={data.sales_by_shop}
            columns={[
              { label: "Shop", accessor: "shop__name" },
              { label: "Sales Count", accessor: "sale_count" },
              {
                label: "Total Amount",
                accessor: "total_amount",
                format: (v) => formatMNumber(Number(v)),
              },
            ]}
          />

          <ReportTable
            title="Sales by Sales Person"
            data={data.sales_by_sales_person}
            columns={[
              { label: "Sales Person", accessor: "sales_person__username" },
              { label: "Sales Count", accessor: "sale_count" },
              {
                label: "Total Amount",
                accessor: "total_amount",
                format: (v) => formatMNumber(Number(v)),
              },
            ]}
          />

          <ReportTable
            title="Sales by Payment Method"
            data={data.sales_by_payment_method}
            columns={[
              { label: "Method", accessor: "payment_method" },
              { label: "Sales Count", accessor: "sale_count" },
              {
                label: "Total Amount",
                accessor: "total_amount",
                format: (v) => formatMNumber(Number(v)),
              },
            ]}
          />

          <ReportTable
            title="Top Products"
            data={data.top_products}
            columns={[
              { label: "Product", accessor: "name" },
              { label: "SKU", accessor: "sku" },
              { label: "Quantity Sold", accessor: "quantity_sold" },
              {
                label: "Revenue",
                accessor: "revenue",
                format: (v) => formatMNumber(Number(v)),
              },
            ]}
          />

          <ReportTable
            title="Warehouse Activity"
            data={data.warehouse_activity}
            columns={[
              { label: "Warehouse", accessor: "name" },
              { label: "Added", accessor: "added" },
              { label: "Removed", accessor: "removed" },
              { label: "Transferred", accessor: "transferred" },
              { label: "Movements", accessor: "movement_count" },
            ]}
          />

          <ReportTable
            title="Low Stock Products"
            data={data.low_stock_products}
            columns={[
              { label: "Product", accessor: "name" },
              { label: "SKU", accessor: "sku" },
              { label: "Quantity", accessor: "total_quantity" },
              { label: "Threshold", accessor: "low_stock_threshold" },
            ]}
            emptyMessage="No low-stock products right now."
          />
        </>
      ) : null}
    </div>
  );
}
