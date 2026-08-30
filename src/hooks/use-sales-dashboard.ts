import { useQuery } from "@tanstack/react-query";

import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { SalesDashboardResponse } from "@/types/dashboard";

export function useSalesDashboard() {
  return useQuery({
    queryKey: ["sales-dashboard"],
    queryFn: async () => {
      const { data } = await instance.get<SalesDashboardResponse>(
        endpoints().dashboard.salesPerson
      );

      return data;
    },
  });
}
