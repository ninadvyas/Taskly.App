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
import { getTasks } from "@/services/task";
import StatusBullet from "@/components/StatusBullet";
import { TaskStatus } from "@/components/form/schema";
import { LayoutDashboard, BarChart2 } from "lucide-react";
import { Task } from "@prisma/client";

const PRIORITY_COLORS: Record<string, string> = {
    low: "text-emerald-500",
    medium: "text-amber-500",
    high: "text-red-500",
};

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
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
            getTasks().then(setTasks).catch(() => { });
        }
    }, [open]);

    const navigate = useCallback(
        (href: string) => {
            router.push(href);
            setOpen(false);
        },
        [router]
    );

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search tasks, pages…" />
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
                                    value={`${task.title} ${task.status} ${task.priority ?? ""}`}
                                    onSelect={() => setOpen(false)}
                                    className="flex items-center gap-2"
                                >
                                    <StatusBullet status={task.status as TaskStatus} />
                                    <span className="flex-1 truncate">{task.title}</span>
                                    {task.priority && (
                                        <span
                                            className={`text-xs font-medium capitalize ${PRIORITY_COLORS[task.priority] ?? ""
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </CommandDialog>
    );
}
