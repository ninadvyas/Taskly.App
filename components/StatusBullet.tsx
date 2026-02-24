import React from "react";
import { TaskStatus } from "./form/schema";
import { cn } from "@/lib/utils";

type Props = {
  status: TaskStatus;
};

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; dot: string }
> = {
  done: { label: "Done", dot: "bg-emerald-500" },
  progress: { label: "In Progress", dot: "bg-amber-500" },
  starting: { label: "Starting", dot: "bg-red-500" },
};

export default function StatusBullet({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.starting;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
