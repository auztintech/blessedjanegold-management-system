"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import type { ActivityLogResponse } from "@/types/activity-log";

interface ActivityLogParams {
  limit?: number;
  offset?: number;
  product?: string;
  actor?: number;
}

export function useActivityLog(params?: ActivityLogParams) {
  return useQuery({
    queryKey: ["activity-log", params],
    queryFn: async () => {
      const { data } = await instance.get<ActivityLogResponse>(
        endpoints().activityLog.list,
        {
          params,
        }
      );

      return data;
    },
  });
}
