import { Check, Clock, X } from "lucide-react";

type Status = "active" | "pending" | "inactive";

const statusConfig: Record<Status, { icon: React.ReactNode; bg: string; text: string }> = {
  active: {
    icon: <Check size={14} strokeWidth={3} />,
    bg: "bg-[#1C8847]/10",
    text: "text-[#1C8847]",
  },
  pending: {
    icon: <Clock size={14} strokeWidth={2.5} />,
    bg: "bg-[#F8AB41]/15",
    text: "text-[#CD6B15]",
  },
  inactive: {
    icon: <X size={14} strokeWidth={3} />,
    bg: "bg-[#7C7070]/10",
    text: "text-[#7C7070]",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status || "").toLowerCase() as Status;
  const config = statusConfig[key] ?? statusConfig.inactive;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className="flex items-center">{config.icon}</span>
      <span className="capitalize">{status || "—"}</span>
    </div>
  );
}