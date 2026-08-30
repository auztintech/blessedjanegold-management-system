"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

import type { SalesByPaymentMethod } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SalesPersonPaymentMethodChartProps {
  data: SalesByPaymentMethod[];
}

export function SalesPersonPaymentMethodChart({
  data,
}: SalesPersonPaymentMethodChartProps) {
  const labels = useMemo(
    () => data.map((item) => formatPaymentMethod(item.payment_method)),
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
        height: 350,
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
      },

      labels,

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
                label: "Total Revenue",
                color: "#6b7280",

                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
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

      noData: {
        text: "No payment data available",
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
    [labels]
  );

  if (!data.length) {
    return (
      <div className="flex h-70 items-center justify-center rounded-lg bg-gray-50 sm:h-87.5">
        <p className="text-sm text-gray-400">No payment data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
}

function formatPaymentMethod(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
