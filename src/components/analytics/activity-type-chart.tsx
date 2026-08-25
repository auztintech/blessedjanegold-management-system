"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { ActivityLogItem, ActivityType } from "@/types/activity-log";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ActivityTypeChartProps {
  data: ActivityLogItem[];
}

const typeLabels: Record<ActivityType, string> = {
  SALE: "Sales",
  TRANSFER: "Transfers",
  ADD: "Stock Added",
  REMOVE: "Stock Removed",
};

export function ActivityTypeChart({ data }: ActivityTypeChartProps) {
  const grouped = useMemo(() => {
    const counts: Record<string, number> = {};

    data.forEach((item) => {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    });

    return counts;
  }, [data]);

  const types = Object.keys(grouped);

  const series = types.map((type) => grouped[type]);

  const labels = types.map((type) => typeLabels[type as ActivityType] ?? type);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },

    labels,

    colors: ["#2563eb", "#f59e0b", "#10b981", "#ef4444"],

    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },

    dataLabels: {
      enabled: true,
      formatter: (value) => `${Number(value).toFixed(0)}%`,
    },

    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
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
              formatter: (value) => String(value),
            },

            total: {
              show: true,
              label: "Activities",
              color: "#6b7280",
              formatter: (w) =>
                w.globals.seriesTotals
                  .reduce((sum: number, value: number) => sum + value, 0)
                  .toString(),
            },
          },
        },
      },
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },

          legend: {
            fontSize: "12px",
          },
        },
      },
    ],

    noData: {
      text: "No activity data available",
    },
  };

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">No activity data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="donut" height={320} />
    </div>
  );
}
