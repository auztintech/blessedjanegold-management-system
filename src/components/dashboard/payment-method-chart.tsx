"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import type { SalesByPaymentMethod } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PaymentMethodChartProps {
  data: SalesByPaymentMethod[];
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const labels = useMemo(
    () =>
      data.map((item) =>
        item.payment_method
          .replaceAll("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      ),
    [data]
  );

  const series = useMemo(
    () => data.map((item) => Number(item.total_amount) || 0),
    [data]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
      },

      labels,

      colors: [
        "#2563eb",
        "#10b981",
        "#f59e0b",
        "#8b5cf6",
        "#ef4444",
        "#06b6d4",
      ],

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
        markers: {
          size: 5,
        },
      },

      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "13px",
                color: "#6b7280",
              },
              value: {
                show: true,
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
                formatter: (value) => formatCurrency(Number(value)),
              },
              total: {
                show: true,
                label: "Total Revenue",
                color: "#6b7280",
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce(
                    (sum: number, value: number) => sum + value,
                    0
                  );

                  return formatCurrency(total);
                },
              },
            },
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
            legend: {
              fontSize: "12px",
            },
          },
        },
      ],

      noData: {
        text: "No payment data available",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },
    }),
    [labels]
  );

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">No payment data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="donut" height={340} />
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
