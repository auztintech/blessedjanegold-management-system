import {
  LayoutDashboard,
  Store,
  Warehouse,
  Package,
  Users,
  FileBarChart,
  History,
  ShoppingCart,
  ClipboardList,
  PackagePlus,
  PackageMinus,
  ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/store/z-store/user";

export interface NavItem {
  name: string;
  link: string;
  icon: LucideIcon;
  dropdownItems?: { name: string; link: string }[];
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

const superAdminNav: NavSection[] = [
  {
    section: "Main",
    items: [{ name: "Dashboard", link: "/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Management",
    items: [
      { name: "Shops", link: "/shops", icon: Store },
      { name: "Warehouses", link: "/warehouses", icon: Warehouse },
      {
        name: "Inventory",
        link: "",
        icon: Package,
        dropdownItems: [
          { name: "Categories", link: "/categories" },
          { name: "Products", link: "/products" },
        ],
      },
      { name: "Sales History", link: "/sales-history", icon: ClipboardList },
    ],
  },
  {
    section: "User Access",
    items: [{ name: "Users", link: "/users", icon: Users }],
  },
  {
    section: "Insights",
    items: [
      { name: "Reports", link: "/reports", icon: FileBarChart },
      { name: "Activity Log", link: "/activity-log", icon: History },
    ],
  },
];

const salesPersonNav: NavSection[] = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", link: "/sales/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Sales",
    items: [
      { name: "New Sale", link: "/sales/new", icon: ShoppingCart },
      { name: "Sales History", link: "/sales/history", icon: ClipboardList },
    ],
  },
];

const warehouseKeeperNav: NavSection[] = [
  {
    section: "Main",
    items: [
      {
        name: "Dashboard",
        link: "/warehouse/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "Warehouse Inventory",
    items: [
      {
        name: "Add Stock",
        link: "/warehouse/add",
        icon: PackagePlus,
      },
      {
        name: "Remove Stock",
        link: "/warehouse/remove",
        icon: PackageMinus,
      },
      {
        name: "Transfer Stock",
        link: "/warehouse/transfer",
        icon: ArrowLeftRight,
      },
    ],
  },
];

export const navByRole: Record<Role, NavSection[]> = {
  SUPER_ADMIN: superAdminNav,
  SALES_PERSON: salesPersonNav,
  WAREHOUSE_KEEPER: warehouseKeeperNav,
};
