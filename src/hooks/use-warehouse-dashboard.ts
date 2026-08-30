import { useQuery } from "@tanstack/react-query";

import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { WarehouseDashboardResponse } from "@/types/dashboard";

export function useWarehouseDashboard() {
  return useQuery({
    queryKey: ["warehouse-dashboard"],
    queryFn: async () => {
      const { data } = await instance.get<WarehouseDashboardResponse>(
        endpoints().dashboard.warehouseKeeper
      );

      return data;
    },
  });
}
