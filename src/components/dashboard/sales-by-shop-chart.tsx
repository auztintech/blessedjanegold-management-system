"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { SalesByShop } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesByShopChartProps {
  data: SalesByShop[];
}

export function SalesByShopChart({ data }: SalesByShopChartProps) {
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
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },

      colors: ["#2563eb"],

      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 5,
          barHeight: "55%",
        },
      },

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
          formatter: (value) => formatCompactCurrency(Number(value)),
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#374151",
            fontSize: "12px",
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
              height: 320,
            },
            plotOptions: {
              bar: {
                barHeight: "65%",
              },
            },
            yaxis: {
              labels: {
                maxWidth: 100,
              },
            },
          },
        },
      ],

      noData: {
        text: "No shop sales data available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },
    }),
    [categories]
  );

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">No shop sales data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="bar" height={340} />
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
