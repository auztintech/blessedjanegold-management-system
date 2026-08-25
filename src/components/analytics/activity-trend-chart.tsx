"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { ActivityLogItem } from "@/types/activity-log";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ActivityTrendChartProps {
  data: ActivityLogItem[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString("en-CA");

      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    });

    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  const categories = chartData.map(([date]) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "2-digit",
      month: "short",
    }).format(new Date(`${date}T00:00:00`))
  );

  const series = [
    {
      name: "Activities",
      data: chartData.map(([, count]) => count),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: "inherit",
    },

    colors: ["#2563eb"],

    stroke: {
      curve: "smooth",
      width: 3,
    },

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
    },

    yaxis: {
      min: 0,
      labels: {
        formatter: (value) => Math.round(value).toString(),
        style: {
          colors: "#6b7280",
          fontSize: "11px",
        },
      },
    },

    tooltip: {
      y: {
        formatter: (value) =>
          `${value} ${value === 1 ? "activity" : "activities"}`,
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
        },
      },
    ],

    noData: {
      text: "No activity data available",
    },
  };

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
}
