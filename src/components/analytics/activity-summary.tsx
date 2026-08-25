"use client";

import {
  Activity,
  ArrowLeftRight,
  PackagePlus,
  ShoppingCart,
} from "lucide-react";

import type { ActivityLogItem } from "@/types/activity-log";

interface ActivitySummaryProps {
  data: ActivityLogItem[];
}

export function ActivitySummary({ data }: ActivitySummaryProps) {
  const total = data.length;

  const sales = data.filter((item) => item.type === "SALE").length;

  const transfers = data.filter((item) => item.type === "TRANSFER").length;

  const stockAdded = data.filter((item) => item.type === "ADD").length;

  const cards = [
    {
      title: "Total Activities",
      value: total,
      icon: Activity,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      title: "Sales",
      value: sales,
      icon: ShoppingCart,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      title: "Transfers",
      value: transfers,
      icon: ArrowLeftRight,
      color: "text-purple-600",
      background: "bg-purple-50",
    },
    {
      title: "Stock Added",
      value: stockAdded,
      icon: PackagePlus,
      color: "text-orange-600",
      background: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString("en-NG")}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.background}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
