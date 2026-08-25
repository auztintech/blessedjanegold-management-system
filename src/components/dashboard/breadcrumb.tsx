"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";

type DashboardType = "admin" | "sales" | "warehouse";

interface BreadcrumbProps {
  dashboardType?: DashboardType;
}

export function Breadcrumb({ dashboardType = "admin" }: BreadcrumbProps) {
  const pathname = usePathname();

  const dashboardHref =
    dashboardType === "sales"
      ? "/sales/dashboard"
      : dashboardType === "warehouse"
      ? "/warehouse/dashboard"
      : "/dashboard";

  const dashboardLabel =
    dashboardType === "sales"
      ? "Sales Dashboard"
      : dashboardType === "warehouse"
      ? "Warehouse Dashboard"
      : "Dashboard";

  const originalSegments = pathname.split("/").filter(Boolean);

  // Remove the route-group prefix from the visible breadcrumb.
  const segments =
    dashboardType === "sales"
      ? originalSegments.filter((segment) => segment !== "sales")
      : dashboardType === "warehouse"
      ? originalSegments.filter((segment) => segment !== "warehouse")
      : originalSegments;

  const visibleSegments = segments.filter((segment) => segment !== "dashboard");

  const items = visibleSegments.map((segment, index) => {
    let hrefSegments: string[];

    if (dashboardType === "sales") {
      hrefSegments = ["sales", ...visibleSegments.slice(0, index + 1)];
    } else if (dashboardType === "warehouse") {
      hrefSegments = ["warehouse", ...visibleSegments.slice(0, index + 1)];
    } else {
      hrefSegments = visibleSegments.slice(0, index + 1);
    }

    const href = "/" + hrefSegments.join("/");

    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      label,
      href,
      isLast: index === visibleSegments.length - 1,
    };
  });

  return (
    <nav
      className="flex items-center gap-1 px-6 py-3 text-sm"
      aria-label="Breadcrumb">
      <Link
        href={dashboardHref}
        className="flex items-center gap-1 text-gray-400 hover:text-orange-500">
        <LayoutDashboard size={14} />
        <span>{dashboardLabel}</span>
      </Link>

      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-gray-300" />

          {item.isLast ? (
            <span className="font-medium text-gray-800 capitalize">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-orange-500 capitalize">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
