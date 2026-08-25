"use client";

import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BorderedLayout } from "@/components/shared/bordered-layout";

import { useActivityLog } from "@/hooks/use-activity-log";

import { ActivitySummary } from "@/components/analytics/activity-summary";
import { ActivityTrendChart } from "@/components/analytics/activity-trend-chart";
import { ActivityTypeChart } from "@/components/analytics/activity-type-chart";
import { TopActivityProductsChart } from "@/components/analytics/top-activity-products-chart";
import { MostActiveUsersChart } from "@/components/analytics/most-active-users-chart";
import { RecentActivity } from "@/components/analytics/recent-activity";

export default function ActivityLogPage() {
  const { data, isLoading, isError } = useActivityLog({
    limit: 200,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-105 rounded-xl" />
          <Skeleton className="h-105 rounded-xl" />
          <Skeleton className="h-105 rounded-xl" />
          <Skeleton className="h-105 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">
          Failed to load activity analytics.
        </p>
      </div>
    );
  }

  const activities = data.results;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Activity Analytics
            </h1>

            <p className="text-sm text-gray-500">
              Monitor sales, stock movements, transfers and user activity.
            </p>
          </div>
        </div>
      </div>

      <ActivitySummary data={activities} />

      <BorderedLayout>
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Activity Trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Number of activities recorded over time.
          </p>
        </div>

        <div className="px-4 pb-4 sm:px-6">
          <ActivityTrendChart data={activities} />
        </div>
      </BorderedLayout>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BorderedLayout>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Activity by Type
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Breakdown of actions performed.
            </p>
          </div>

          <div className="px-4 pb-4 sm:px-6">
            <ActivityTypeChart data={activities} />
          </div>
        </BorderedLayout>

        <BorderedLayout>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Active Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products involved in the most activity.
            </p>
          </div>

          <div className="px-4 pb-4 sm:px-6">
            <TopActivityProductsChart data={activities} />
          </div>
        </BorderedLayout>

        <BorderedLayout>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Most Active Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Users with the highest number of actions.
            </p>
          </div>

          <div className="px-4 pb-4 sm:px-6">
            <MostActiveUsersChart data={activities} />
          </div>
        </BorderedLayout>

        <BorderedLayout>
          <div className="px-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest actions across the system.
            </p>
          </div>

          <div className="px-6 pb-2">
            <RecentActivity data={activities.slice(0, 10)} />
          </div>
        </BorderedLayout>
      </div>
    </div>
  );
}
