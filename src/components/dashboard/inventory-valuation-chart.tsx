"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { InventoryValuation } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface InventoryValuationChartProps {
  data: InventoryValuation;
}

export function InventoryValuationChart({
  data,
}: InventoryValuationChartProps) {
  const values = useMemo(
    () => [Number(data.warehouse_value) || 0, Number(data.shop_value) || 0],
    [data]
  );

  const series = values;

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
      },

      labels: ["Warehouse", "Shop"],

      colors: ["#2563eb", "#8b5cf6"],

      stroke: {
        width: 2,
        colors: ["#ffffff"],
      },

      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "13px",
      },

      dataLabels: {
        enabled: false,
      },

      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,

              name: {
                show: true,
                color: "#6b7280",
              },

              value: {
                show: true,
                color: "#111827",
                fontSize: "18px",
                fontWeight: 600,
                formatter: (value) => formatCompactCurrency(Number(value)),
              },

              total: {
                show: true,
                label: "Total Value",
                color: "#6b7280",
                formatter: () =>
                  formatCompactCurrency(Number(data.total_value) || 0),
              },
            },
          },
        },
      },

      tooltip: {
        y: {
          formatter: (value) => formatCurrency(value),
        },
      },

      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],

      noData: {
        text: "No inventory valuation available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },
    }),
    [data.total_value]
  );

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="donut" height={340} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-600">Warehouse</p>

          <p className="mt-1 truncate text-sm font-semibold text-blue-900">
            {formatCurrency(values[0])}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-3">
          <p className="text-xs text-purple-600">Shops</p>

          <p className="mt-1 truncate text-sm font-semibold text-purple-900">
            {formatCurrency(values[1])}
          </p>
        </div>
      </div>
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

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `₦${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1)}K`;
  }

  return `₦${value.toLocaleString("en-NG")}`;
}
