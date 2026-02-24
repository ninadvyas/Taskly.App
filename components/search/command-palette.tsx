"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getTasks } from "@/services/task";
import StatusBullet from "@/components/StatusBullet";
import { TaskStatus } from "@/components/form/schema";
import { LayoutDashboard, BarChart2, CalendarDays } from "lucide-react";
import { Task } from "@prisma/client";
import Form from "@/components/form";

const PRIORITY_BADGE: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    low: { label: "Low", variant: "secondary" },
    medium: { label: "Medium", variant: "outline" },
    high: { label: "High", variant: "destructive" },
};

/** Build the searchable string for a task — includes title, status, priority, and dates */
function taskSearchValue(task: Task): string {
    const parts: string[] = [task.title, task.status, task.priority ?? ""];
    if (task.dueDate) {
        const d = new Date(task.dueDate);
        parts.push(
            d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            d.toISOString().split("T")[0] // YYYY-MM-DD
        );
    }
    if (task.createdAt) {
        const d = new Date(task.createdAt);
        parts.push(
            d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );
    }
    return parts.join(" ");
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const router = useRouter();

    // Open on Cmd+K / Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Load tasks when palette opens
    useEffect(() => {
        if (open) {
            getTasks()
                .then(setTasks)
                .catch(() => { });
        }
    }, [open]);

    const navigate = useCallback(
        (href: string) => {
            router.push(href);
            setOpen(false);
        },
        [router]
    );

    const openTask = useCallback((task: Task) => {
        setOpen(false);
        // Small delay so the command dialog closes before the task dialog opens
        setTimeout(() => setSelectedTask(task), 80);
    }, []);

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search tasks by title, status, priority, date…" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Pages">
                        <CommandItem onSelect={() => navigate("/")}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Tasks
                        </CommandItem>
                        <CommandItem onSelect={() => navigate("/progress")}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Progress
                        </CommandItem>
                    </CommandGroup>

                    {tasks.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Your Tasks">
                                {tasks.map((task) => (
                                    <CommandItem
                                        key={task.id}
                                        // All searchable fields concatenated — cmdk filters against this
                                        value={taskSearchValue(task)}
                                        onSelect={() => openTask(task)}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        {/* Status indicator */}
                                        <StatusBullet status={task.status as TaskStatus} />

                                        {/* Title */}
                                        <span className="flex-1 truncate font-medium">{task.title}</span>

                                        {/* Due date */}
                                        {task.dueDate && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                                <CalendarDays className="h-3 w-3" />
                                                {new Date(task.dueDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}

                                        {/* Priority badge */}
                                        {task.priority && PRIORITY_BADGE[task.priority] && (
                                            <Badge
                                                variant={PRIORITY_BADGE[task.priority].variant}
                                                className="text-[10px] px-1.5 py-0 shrink-0"
                                            >
                                                {PRIORITY_BADGE[task.priority].label}
                                            </Badge>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>

            {/* Task detail dialog — opens when a task is selected from search */}
            <Dialog
                open={!!selectedTask}
                onOpenChange={(open) => !open && setSelectedTask(null)}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    {selectedTask && (
                        <Form
                            task={selectedTask}
                            onSubmitOrDelete={() => setSelectedTask(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
