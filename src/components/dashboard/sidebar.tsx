"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useUserStore } from "@/store/z-store/user";
import { navByRole } from "./nav-config";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const sections = user?.role ? navByRole[user.role] ?? [] : [];

  const isActive = (link: string) =>
    pathname === link || pathname.startsWith(link + "/");

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-200",
          "fixed inset-y-0 left-0 z-50 w-64 h-full",
          "lg:static lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Inventory<span className="text-orange-500">OS</span>
            </span>
          )}

          <div className="flex items-center gap-2">
            {/* Desktop collapse */}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
              {collapsed ? (
                <ChevronsRight size={14} />
              ) : (
                <ChevronsLeft size={14} />
              )}
            </button>

            {/* Mobile close */}
            <button
              onClick={onMobileClose}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.section}>
              {/* Section title */}
              {!collapsed && (
                <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {section.section}
                </p>
              )}

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const hasDropdown = !!item.dropdownItems?.length;

                  /*
                   * Normal item:
                   *   active when its own link matches.
                   *
                   * Dropdown item:
                   *   active when any of its children matches.
                   *
                   * This means:
                   * /categories -> Inventory active
                   * /products   -> Inventory active
                   */
                  const active = hasDropdown
                    ? item.dropdownItems!.some((sub) => isActive(sub.link))
                    : isActive(item.link);

                  /*
                   * Automatically open dropdown if one of its
                   * children is currently active.
                   */
                  const isDropdownOpen =
                    expandedItem === item.name ||
                    (hasDropdown &&
                      item.dropdownItems!.some((sub) => isActive(sub.link)));

                  return (
                    <li key={item.name}>
                      {hasDropdown ? (
                        <button
                          onClick={() =>
                            setExpandedItem((prev) =>
                              prev === item.name ? null : item.name
                            )
                          }
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-2xl text-sm transition",
                            active
                              ? "bg-orange-50 text-orange-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          )}>
                          <span className="flex items-center gap-3">
                            <Icon size={18} />
                            {!collapsed && item.name}
                          </span>

                          {!collapsed &&
                            (isDropdownOpen ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            ))}
                        </button>
                      ) : (
                        <Link
                          href={item.link}
                          onClick={onMobileClose}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-2xl text-sm transition",
                            active
                              ? "bg-orange-50 text-orange-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          )}>
                          <Icon size={18} />
                          {!collapsed && item.name}
                        </Link>
                      )}

                      {/* Dropdown items */}
                      {hasDropdown && isDropdownOpen && !collapsed && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {item.dropdownItems!.map((sub) => (
                            <li key={sub.link}>
                              <Link
                                href={sub.link}
                                onClick={onMobileClose}
                                className={cn(
                                  "block px-3 py-1.5 rounded-md text-sm",
                                  pathname === sub.link
                                    ? "text-black! font-medium"
                                    : "text-gray-500 hover:text-gray-700"
                                )}>
                                • {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
