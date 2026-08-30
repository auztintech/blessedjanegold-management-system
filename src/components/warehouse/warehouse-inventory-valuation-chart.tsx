"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

import type { WarehouseInventoryValuation } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface WarehouseInventoryValuationChartProps {
  data: WarehouseInventoryValuation;
}

export function WarehouseInventoryValuationChart({
  data,
}: WarehouseInventoryValuationChartProps) {
  const series = useMemo(
    () => [
      {
        name: "Value",
        data: [Number(data.warehouse_value) || 0, Number(data.shop_value) || 0],
      },
    ],
    [data]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%",
          borderRadius: 6,
        },
      },

      colors: ["#2563eb"],

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },

      xaxis: {
        categories: ["Warehouse Inventory", "Shop Inventory"],
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
          formatter: (value) => formatCompactCurrency(value),
        },
      },

      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => formatCurrency(value),
        },
      },

      noData: {
        text: "No inventory valuation available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },

      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 280,
            },
          },
        },
      ],
    }),
    []
  );

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="bar" height={350} />
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
  const amount = Number(value) || 0;

  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }

  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }

  return `₦${amount.toLocaleString("en-NG")}`;
}
