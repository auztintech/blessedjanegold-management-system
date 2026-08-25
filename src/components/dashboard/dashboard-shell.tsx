"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Breadcrumb } from "./breadcrumb";

type DashboardType = "admin" | "sales" | "warehouse";

interface DashboardShellProps {
  children: React.ReactNode;
  dashboardType?: DashboardType;
}

export function DashboardShell({
  children,
  dashboardType = "admin",
}: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileNavOpen(true)} />

        <Breadcrumb dashboardType={dashboardType} />

        <main className="flex-1 overflow-y-auto bg-[#f6f9fc] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
