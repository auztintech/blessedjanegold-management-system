"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { ActivityLogItem } from "@/types/activity-log";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MostActiveUsersChartProps {
  data: ActivityLogItem[];
}

export function MostActiveUsersChart({ data }: MostActiveUsersChartProps) {
  const users = useMemo(() => {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      grouped.set(item.actor, (grouped.get(item.actor) ?? 0) + 1);
    });

    return Array.from(grouped.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },

    colors: ["#8b5cf6"],

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
      categories: users.map(([user]) => user),
      labels: {
        formatter: (value) => Math.round(Number(value)).toString(),
        style: {
          colors: "#6b7280",
          fontSize: "11px",
        },
      },
    },

    yaxis: {
      labels: {
        maxWidth: 150,
        style: {
          colors: "#374151",
          fontSize: "12px",
        },
      },
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} ${value === 1 ? "action" : "actions"}`,
      },
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 320,
          },
          yaxis: {
            labels: {
              maxWidth: 100,
            },
          },
        },
      },
    ],
  };

  if (!users.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">No user activity available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart
        options={options}
        series={[
          {
            name: "Actions",
            data: users.map(([, count]) => count),
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}
