import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell dashboardType="sales">{children}</DashboardShell>;
}
