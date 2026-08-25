"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { ActivityLogItem } from "@/types/activity-log";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TopActivityProductsChartProps {
  data: ActivityLogItem[];
}

export function TopActivityProductsChart({
  data,
}: TopActivityProductsChartProps) {
  const products = useMemo(() => {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      grouped.set(
        item.product,
        (grouped.get(item.product) ?? 0) + item.quantity
      );
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

    colors: ["#10b981"],

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
      categories: products.map(([product]) => product),
      labels: {
        formatter: (value) => Math.round(Number(value)).toLocaleString("en-NG"),
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
        formatter: (value) => `${value.toLocaleString("en-NG")} units`,
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

    noData: {
      text: "No product activity available",
    },
  };

  if (!products.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">No product activity available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart
        options={options}
        series={[
          {
            name: "Units",
            data: products.map(([, quantity]) => quantity),
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}
