import React from "react";
import { CardDescription, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getTasks } from "@/services/task";
import { getDate } from "@/utils/getDate";
import StatusBullet from "../StatusBullet";
import { TaskStatus } from "../form/schema";
import TitleCell from "./title-cell";
import { CalendarDays, ClipboardList } from "lucide-react";

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "text-emerald-500 font-medium" },
  medium: { label: "Medium", className: "text-amber-500 font-medium" },
  high: { label: "High", className: "text-red-500 font-semibold" },
};

function formatDueDate(date: Date | null | undefined) {
  if (!date) return <span className="text-muted-foreground/50">—</span>;
  const d = new Date(date);
  const today = new Date();
  const isOverdue = d < today;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
        }`}
    >
      <CalendarDays className="h-3 w-3" />
      {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      {isOverdue && " ⚠"}
    </span>
  );
}

export default async function TaskList() {
  const tasks = await getTasks();

  if (tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <CardTitle>Your tasks for today</CardTitle>
          <CardDescription>Let&apos;s get everything done</CardDescription>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <ClipboardList className="h-12 w-12 opacity-30" />
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-xs">Add your first task above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <CardTitle>Your tasks for today</CardTitle>
        <CardDescription>Let&apos;s get everything done</CardDescription>
      </div>
      <Table className="w-full h-full">
        <TableCaption>A list of your tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group">
              <TableCell className="font-medium cursor-pointer text-xs text-muted-foreground whitespace-nowrap">
                {getDate(task.createdAt)}
              </TableCell>
              <TableCell className="font-medium cursor-cell">
                <TitleCell task={task} />
              </TableCell>
              <TableCell className="text-xs">
                {task.priority && PRIORITY_CONFIG[task.priority] ? (
                  <span className={PRIORITY_CONFIG[task.priority].className}>
                    {PRIORITY_CONFIG[task.priority].label}
                  </span>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </TableCell>
              <TableCell>{formatDueDate(task.dueDate)}</TableCell>
              <TableCell className="capitalize cursor-pointer">
                <StatusBullet status={task.status as TaskStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
