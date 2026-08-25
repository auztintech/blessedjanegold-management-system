"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { DashboardResponse } from "@/types/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const { data } = await instance.get<DashboardResponse>(
        endpoints().dashboard.overview
      );
      return data;
    },
  });
}
