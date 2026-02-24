import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { getTasks } from "@/services/task";
import { auth } from "@/auth";
import { getDate } from "@/utils/getDate";
import StatusBullet from "../StatusBullet";
import { TaskStatus } from "../form/schema";
import TitleCell from "./title-cell";
import { CalendarDays, ClipboardList, LogIn } from "lucide-react";
import Link from "next/link";

const PRIORITY_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "outline" },
  high: { label: "High", variant: "destructive" },
};

function formatDueDate(date: Date | null | undefined) {
  if (!date) return <span className="text-muted-foreground/40 text-xs">—</span>;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = d < today;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"
        }`}
    >
      <CalendarDays className="h-3 w-3 shrink-0" />
      {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      {isOverdue && (
        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 ml-1">
          Overdue
        </Badge>
      )}
    </span>
  );
}

export default async function TaskList() {
  const session = await auth();
  const isSignedIn = !!session?.user;

  // Not signed in — show a friendly prompt
  if (!isSignedIn) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Sign in to see and manage your tasks</CardDescription>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-5 rounded-lg border border-dashed">
          {/* Task list illustration */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-30"
          >
            <rect x="8" y="8" width="56" height="56" rx="8" fill="currentColor" fillOpacity="0.07" />
            <rect x="16" y="20" width="32" height="4" rx="2" fill="currentColor" fillOpacity="0.4" />
            <rect x="16" y="30" width="24" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
            <rect x="16" y="40" width="28" height="4" rx="2" fill="currentColor" fillOpacity="0.3" />
            <circle cx="52" cy="52" r="12" fill="currentColor" fillOpacity="0.12" />
            <path d="M48 52l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
          </svg>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold">Sign in to see your tasks</p>
            <p className="text-xs text-muted-foreground">
              Your tasks are private and linked to your account
            </p>
          </div>
          <Link href="/signin">
            <Button size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign in with Google
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tasks = await getTasks();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>
          {tasks.length === 0
            ? "No tasks yet — add one above"
            : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
        </CardDescription>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 rounded-lg border border-dashed text-muted-foreground">
          <ClipboardList className="h-10 w-10 opacity-20" />
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs">Add your first task above to get started</p>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] py-2 text-xs">Date</TableHead>
                  <TableHead className="py-2 text-xs">Title</TableHead>
                  <TableHead className="w-[90px] py-2 text-xs text-center">Priority</TableHead>
                  <TableHead className="w-[140px] py-2 text-xs">Due</TableHead>
                  <TableHead className="w-[120px] py-2 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="group h-9">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-1.5">
                      {getDate(task.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium py-1.5">
                      <TitleCell task={task} />
                    </TableCell>
                    <TableCell className="py-1.5 text-center">
                      {task.priority && PRIORITY_CONFIG[task.priority] ? (
                        <Badge
                          variant={PRIORITY_CONFIG[task.priority].variant}
                          className="text-[11px] px-1.5 py-0"
                        >
                          {PRIORITY_CONFIG[task.priority].label}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-1.5 whitespace-nowrap">
                      {formatDueDate(task.dueDate)}
                    </TableCell>
                    <TableCell className="py-1.5 whitespace-nowrap">
                      <StatusBullet status={task.status as TaskStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
