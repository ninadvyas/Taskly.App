import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import React from "react";
import Navbar from "@/components/navbar";
import {
    getTaskCountByStatus,
    getTasksCreatedPerDay,
    getRecentTasks,
} from "@/services/task";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBullet from "@/components/StatusBullet";
import { TaskStatus } from "@/components/form/schema";
import { getDate } from "@/utils/getDate";
import LineChartComp from "@/components/charts/line-chart";
import Charts from "@/components/charts";
import { CheckCircle, CircleDot, Circle, ListTodo } from "lucide-react";

export const metadata: Metadata = {
    title: "Progress",
    description:
        "Track your productivity — view task completion stats, a 7-day creation chart, status breakdown, and recent activity.",
    openGraph: {
        title: "Progress | Taskly",
        description:
            "Track your productivity — view task completion stats, a 7-day creation chart, status breakdown, and recent activity.",
        images: [{ url: "/images/progress.png", width: 1200, height: 630, alt: "Taskly Progress Dashboard" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Progress | Taskly",
        description: "Track your productivity with Taskly's analytics dashboard.",
        images: ["/images/progress.png"],
    },
};

const PRIORITY_CONFIG: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    low: { label: "Low", variant: "secondary" },
    medium: { label: "Medium", variant: "outline" },
    high: { label: "High", variant: "destructive" },
};

export default async function ProgressPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/signin");
    }

    const [counts, perDay, recent] = await Promise.all([
        getTaskCountByStatus(),
        getTasksCreatedPerDay(),
        getRecentTasks(8),
    ]);

    const total = counts.starting + counts.progress + counts.done;
    const completionRate =
        total > 0 ? Math.round((counts.done / total) * 100) : 0;

    const stats = [
        {
            label: "Total Tasks",
            value: total,
            icon: <ListTodo className="h-4 w-4 text-muted-foreground" />,
        },
        {
            label: "Done",
            value: counts.done,
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
            note: `${completionRate}% completion rate`,
        },
        {
            label: "In Progress",
            value: counts.progress,
            icon: <CircleDot className="h-4 w-4 text-amber-500" />,
        },
        {
            label: "Not Started",
            value: counts.starting,
            icon: <Circle className="h-4 w-4 text-muted-foreground" />,
        },
    ];

    return (
        <div className="h-screen flex flex-col px-4 md:px-16 lg:px-32 xl:px-56 2xl:px-80 overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <Card key={s.label}>
                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardDescription className="text-xs font-medium">
                                    {s.label}
                                </CardDescription>
                                {s.icon}
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{s.value}</p>
                                {s.note && (
                                    <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[260px]">
                    <div className="md:col-span-2 overflow-hidden">
                        <LineChartComp data={perDay} />
                    </div>
                    <div className="overflow-hidden">
                        <Charts />
                    </div>
                </div>

                {/* Recent tasks */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Recent Tasks</CardTitle>
                        <CardDescription>Last 8 tasks you created</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-muted-foreground py-8 text-sm"
                                        >
                                            No tasks yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recent.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {getDate(task.createdAt)}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[240px] truncate">
                                                {task.title}
                                            </TableCell>
                                            <TableCell>
                                                {task.priority && PRIORITY_CONFIG[task.priority] ? (
                                                    <Badge
                                                        variant={PRIORITY_CONFIG[task.priority].variant}
                                                        className="text-xs"
                                                    >
                                                        {PRIORITY_CONFIG[task.priority].label}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground/40">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBullet status={task.status as TaskStatus} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
