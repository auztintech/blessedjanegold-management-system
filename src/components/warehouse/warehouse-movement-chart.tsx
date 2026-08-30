"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

import type { WarehouseMovementCount } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface WarehouseMovementChartProps {
  data: WarehouseMovementCount[];
}

export function WarehouseMovementChart({ data }: WarehouseMovementChartProps) {
  const categories = useMemo(
    () => data.map((item) => formatMovementType(item.movement_type)),
    [data]
  );

  const series = useMemo(
    () => [
      {
        name: "Movements",
        data: data.map((item) => item.count),
      },
    ],
    [data]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },

      labels: categories,

      colors: [
        "#2563eb",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ],

      dataLabels: {
        enabled: false,
      },

      legend: {
        position: "bottom",
        fontSize: "12px",
        labels: {
          colors: "#6b7280",
        },
      },

      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total Movements",
                color: "#6b7280",
                formatter: (w) => {
                  return w.globals.seriesTotals
                    .reduce((a: number, b: number) => a + b, 0)
                    .toLocaleString("en-NG");
                },
              },
            },
          },
        },
      },

      tooltip: {
        y: {
          formatter: (value) => `${value.toLocaleString("en-NG")} movements`,
        },
      },

      noData: {
        text: "No movement data available",
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
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50 sm:h-87.5">
        <p className="text-sm text-gray-400">No stock movements recorded.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
}

function formatMovementType(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
