"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

import type { SalesPersonTopProduct } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesPersonTopProductsChartProps {
  data: SalesPersonTopProduct[];
}

export function SalesPersonTopProductsChart({
  data,
}: SalesPersonTopProductsChartProps) {
  const categories = useMemo(() => data.map((item) => item.name), [data]);

  const series = useMemo(
    () => [
      {
        name: "Units Sold",
        data: data.map((item) => item.quantity_sold),
      },
    ],
    [data]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 380,
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },

      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 5,
          barHeight: "60%",
        },
      },

      colors: ["#10b981"],

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },

      xaxis: {
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
      },

      yaxis: {
        categories,
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
      },

      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `${value.toLocaleString("en-NG")} units`,
        },
      },

      noData: {
        text: "No product sales data available",
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
              height: 300,
            },
          },
        },
      ],
    }),
    [categories]
  );

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50 sm:h-95">
        <p className="text-sm text-gray-400">
          No product sales data available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="bar" height={380} />
    </div>
  );
}
