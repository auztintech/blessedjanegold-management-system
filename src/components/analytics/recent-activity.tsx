"use client";

import {
  ArrowLeftRight,
  PackagePlus,
  PackageMinus,
  ShoppingCart,
} from "lucide-react";

import type { ActivityLogItem, ActivityType } from "@/types/activity-log";

interface RecentActivityProps {
  data: ActivityLogItem[];
}

const activityConfig: Record<
  ActivityType,
  {
    label: string;
    icon: typeof ShoppingCart;
    color: string;
    background: string;
  }
> = {
  SALE: {
    label: "Sale",
    icon: ShoppingCart,
    color: "text-blue-600",
    background: "bg-blue-50",
  },
  TRANSFER: {
    label: "Transfer",
    icon: ArrowLeftRight,
    color: "text-purple-600",
    background: "bg-purple-50",
  },
  ADD: {
    label: "Stock Added",
    icon: PackagePlus,
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },
  REMOVE: {
    label: "Stock Removed",
    icon: PackageMinus,
    color: "text-red-600",
    background: "bg-red-50",
  },
};

export function RecentActivity({ data }: RecentActivityProps) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((activity, index) => {
        const config = activityConfig[activity.type] ?? activityConfig.SALE;

        const Icon = config.icon;

        return (
          <div
            key={`${activity.timestamp}-${index}`}
            className="flex gap-3 py-4">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.background}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-5 text-gray-700">
                {activity.description}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                <span>{activity.actor}</span>

                <span>
                  {new Date(activity.timestamp).toLocaleString("en-NG", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <span
              className={`hidden shrink-0 text-xs font-medium sm:block ${config.color}`}>
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
