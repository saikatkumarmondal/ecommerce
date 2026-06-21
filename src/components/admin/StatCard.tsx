import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 w-full min-w-0">
      {/* Icon Container: Scales slightly on mobile, prevents shrinking */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      
      {/* Text Container: Prevents overflow issues with long strings */}
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold truncate text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}