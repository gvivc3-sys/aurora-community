import { StarSolidIcon } from "@/components/icons";

export default function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 ${className}`}
    >
      <StarSolidIcon className="h-3 w-3" />
      Admin
    </span>
  );
}
