"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { SalesTrend } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesTrendChartProps {
  data: SalesTrend[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const categories = useMemo(
    () =>
      data.map((item) =>
        new Intl.DateTimeFormat("en-NG", {
          day: "2-digit",
          month: "short",
        }).format(new Date(item.date))
      ),
    [data]
  );

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
        type: "area",
        height: 380,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: "inherit",
      },

      stroke: {
        curve: "smooth",
        width: 3,
      },

      colors: ["#2563eb"],

      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.03,
          stops: [0, 100],
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
        x: {
          show: true,
        },
        y: {
          formatter: (value) => formatCurrency(value),
        },
      },

      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },

      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 280,
            },
            stroke: {
              width: 2,
            },
            xaxis: {
              labels: {
                rotate: -45,
                hideOverlappingLabels: true,
              },
            },
          },
        },
      ],

      noData: {
        text: "No sales data available",
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
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50 sm:h-95">
        <p className="text-sm text-gray-400">
          No sales data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart
        options={options}
        series={series}
        type="area"
        height="100%"
      />
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
