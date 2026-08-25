"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { TopProduct } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TopProductsChartProps {
  data: TopProduct[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const categories = useMemo(() => data.map((item) => item.name), [data]);

  const series = useMemo(
    () => [
      {
        name: "Revenue",
        data: data.map((item) => Number(item.revenue) || 0),
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

      colors: ["#10b981"],

      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 5,
          barHeight: "60%",
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
          maxWidth: 180,
          style: {
            colors: "#374151",
            fontSize: "12px",
          },
        },
      },

      tooltip: {
        custom: ({ dataPointIndex }) => {
          const product = data[dataPointIndex];

          if (!product) {
            return "";
          }

          return `
            <div class="px-3 py-2">
              <div class="font-medium text-gray-900">
                ${escapeHtml(product.name)}
              </div>
              <div class="text-xs text-gray-500">
                SKU: ${escapeHtml(product.sku)}
              </div>
              <div class="mt-1 text-sm font-semibold text-gray-900">
                ${formatCurrency(Number(product.revenue))}
              </div>
              <div class="text-xs text-gray-500">
                ${product.quantity_sold.toLocaleString("en-NG")} units sold
              </div>
            </div>
          `;
        },
      },

      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 350,
            },
            yaxis: {
              labels: {
                maxWidth: 110,
              },
            },
          },
        },
      ],

      noData: {
        text: "No product sales data available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },
    }),
    [categories, data]
  );

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">
          No product sales data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="bar" height={400} />
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
