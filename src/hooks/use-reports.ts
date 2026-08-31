"use client";

import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { ReportSummary } from "@/types/report";

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  shop?: number;
  warehouse?: number;
}

export function useReportSummary(filters: ReportFilters) {
  return useQuery({
    queryKey: ["report-summary", filters],
    queryFn: async () => {
      const { data } = await instance.get<ReportSummary>(endpoints().reports.summary, {
        params: { ...filters, export: "json" },
      });
      return data;
    },
  });
}

export async function exportReport(filters: ReportFilters, format: "csv" | "pdf") {
  const response = await instance.get(endpoints().reports.summary, {
    params: { ...filters, export: format },
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: format === "pdf" ? "application/pdf" : "text/csv",
  });
  const url = URL.createObjectURL(blob);

  if (format === "pdf") {
    // Opens in a new tab — browser's native PDF viewer gives view + print for free
    window.open(url, "_blank");
  } else {
    const disposition = response.headers["content-disposition"];
    const match = disposition?.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] || "report.csv";

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}