import { Crown, ShoppingCart, Warehouse } from "lucide-react";
import { Role } from "@/store/z-store/user";

interface RoleConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
  label: string;
}

const roleConfig: Record<Role, RoleConfig> = {
  SUPER_ADMIN: {
    icon: <Crown size={14} />,
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Super Admin",
  },
  SALES_PERSON: {
    icon: <ShoppingCart size={14} />,
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Sales Person",
  },
  WAREHOUSE_KEEPER: {
    icon: <Warehouse size={14} />,
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Warehouse Keeper",
  },
};

export function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role as Role];

  if (!config) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
        {role || "—"}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className="flex items-center">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
