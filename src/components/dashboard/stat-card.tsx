import { LucideIcon } from "lucide-react";
import { formatMNumber } from "@/lib/currency";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  base?: string;
  unit?: string;
  money?: boolean;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  base,
  unit,
  money,
}: StatCardProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 flex items-center gap-4">
      <div className="bg-orange-100 p-3 rounded-full shrink-0">
        <Icon className="text-orange-500" size={22} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-gray-500 text-sm truncate">{title}</span>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          {money ? formatMNumber(Number(value)) : value}{" "}
          {base && (
            <sub className="text-gray-400 font-normal text-xs">{base}</sub>
          )}
        </span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}
