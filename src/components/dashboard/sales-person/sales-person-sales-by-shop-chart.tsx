"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

import type { SalesByShop } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesPersonSalesByShopChartProps {
  data: SalesByShop[];
}

export function SalesPersonSalesByShopChart({
  data,
}: SalesPersonSalesByShopChartProps) {
  const categories = useMemo(() => data.map((item) => item.shop__name), [data]);

  const series = useMemo(
    () => [
      {
        name: "Revenue",
        data: data.map((item) => Number(item.total_amount) || 0),
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
          columnWidth: "50%",
          borderRadius: 5,
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
        categories,
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
        text: "No shop sales data available",
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
    [categories]
  );

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50 sm:h-87.5">
        <p className="text-sm text-gray-400">No shop sales data available.</p>
      </div>
    );
  }

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
