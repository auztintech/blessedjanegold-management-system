"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { WarehouseActivity } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface WarehouseActivityChartProps {
  data: WarehouseActivity[];
}

export function WarehouseActivityChart({ data }: WarehouseActivityChartProps) {
  const categories = useMemo(() => data.map((item) => item.name), [data]);

  const series = useMemo(
    () => [
      {
        name: "Movements",
        data: data.map((item) => item.movement_count_last_30_days),
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

      colors: ["#f59e0b"],

      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "55%",
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
          rotate: -30,
          hideOverlappingLabels: true,
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
      },

      yaxis: {
        min: 0,
        labels: {
          formatter: (value) => Math.round(value).toLocaleString("en-NG"),
          style: {
            colors: "#6b7280",
            fontSize: "11px",
          },
        },
      },

      tooltip: {
        y: {
          formatter: (value) => `${value.toLocaleString("en-NG")} movements`,
        },
      },

      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 300,
            },
            plotOptions: {
              bar: {
                columnWidth: "65%",
              },
            },
          },
        },
      ],

      noData: {
        text: "No warehouse activity available",
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
        <p className="text-sm text-gray-400">
          No warehouse activity available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="bar" height={340} />
    </div>
  );
}
