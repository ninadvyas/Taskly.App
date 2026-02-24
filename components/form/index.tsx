"use client";

import React, { useState } from "react";
import {
  Form as FormComp,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema, { FormSchema, TaskStatus } from "./schema";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "../ui/select";
import StatusBullet from "../StatusBullet";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createTask, deleteTask, updateTask } from "@/services/task";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@prisma/client";
import { Switch } from "../ui/switch";
import { TaskPriority } from "./schema";
import { useSession } from "next-auth/react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CalendarIcon,
  Loader2,
  Plus,
  Trash2,
  Save,
  CalendarCheck2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type Props = {
  task?: Task;
  onSubmitOrDelete?: () => void;
};

function GoogleCalendarIcon() {
  const day = new Date().getDate();
  return (
    <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-border flex flex-col bg-white shadow-sm select-none">
      <div className="flex h-[4px]">
        <div className="flex-1 bg-[#4285F4]" />
        <div className="flex-1 bg-[#EA4335]" />
        <div className="flex-1 bg-[#FBBC05]" />
        <div className="flex-1 bg-[#34A853]" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[13px] font-bold text-gray-800 leading-none">
          {day}
        </span>
      </div>
    </div>
  );
}

const PRIORITY_OPTIONS: { value: "low" | "medium" | "high"; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-emerald-500" },
  { value: "medium", label: "Medium", color: "text-amber-500" },
  { value: "high", label: "High", color: "text-red-500" },
];

export default function Form({ task, onSubmitOrDelete }: Props) {
  const isEditing = !!task;
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: (task.priority as TaskPriority) ?? "medium",
        dueDate: task.dueDate
          ? (() => {
            // Parse the stored date as local time to avoid UTC off-by-one
            const d = new Date(task.dueDate as unknown as Date);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          })()
          : "",
        syncToCalendar: !!(task.googleEventId),
      }
      : {
        title: "",
        description: "",
        status: "starting" as TaskStatus,
        priority: "medium" as TaskPriority,
        dueDate: "",
        syncToCalendar: false,
      },
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [calOpen, setCalOpen] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    try {
      if (!isEditing) {
        await createTask(data);
        form.reset();
      } else {
        const newTask = {
          id: task.id,
          createdAt: task.createdAt,
          description: data.description || "",
          status: data.status,
          title: data.title,
          priority: data.priority || null,
          dueDate: data.dueDate
            ? new Date(data.dueDate + "T12:00:00")  // noon = safe from any UTC offset
            : null,
          googleEventId: task.googleEventId,
          userId: task.userId,
        } as Task;
        await updateTask(newTask, data.syncToCalendar ?? false);
      }
      toast({
        title: isEditing ? "Task updated!" : "Task created!",
        description: isEditing
          ? "Your changes have been saved."
          : data.syncToCalendar
            ? "Added to your Google Calendar."
            : "New task added to your list.",
      });
      onSubmitOrDelete?.();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!task?.id) return;
    setIsLoading(true);
    try {
      await deleteTask(task.id);
      toast({ title: "Task deleted." });
      onSubmitOrDelete?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormComp {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormControl>
                <Input
                  placeholder="What needs to be done?"
                  className="text-base"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Controls row */}
        <div className="flex flex-wrap items-start gap-2">
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="starting">
                      <StatusBullet status="starting" />
                    </SelectItem>
                    <SelectItem value="progress">
                      <StatusBullet status="progress" />
                    </SelectItem>
                    <SelectItem value="done">
                      <StatusBullet status="done" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className={cn("font-medium", opt.color)}>
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => {
              // Watch reactively so the calendar selection updates on every change
              const dueDateVal = form.watch("dueDate");
              const selectedDate = dueDateVal
                ? new Date(dueDateVal + "T00:00:00")
                : undefined;
              return (
                <FormItem className="flex flex-col">
                  <Popover open={calOpen} onOpenChange={setCalOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-40 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {selectedDate
                            ? format(selectedDate, "MMM d, yyyy")
                            : "Due date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) {
                            field.onChange("");
                          } else {
                            const y = date.getFullYear();
                            const m = String(date.getMonth() + 1).padStart(2, "0");
                            const d = String(date.getDate()).padStart(2, "0");
                            field.onChange(`${y}-${m}-${d}`);
                          }
                          setCalOpen(false); // close after any selection
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />

          {!isEditing && (
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Task
            </Button>
          )}
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormControl>
                <Textarea
                  placeholder="Add details about this task (optional)"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Google Calendar Sync — only for signed-in users */}
        {isSignedIn && (
          <FormField
            control={form.control}
            name="syncToCalendar"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 rounded-lg border px-4 py-3 bg-muted/40">
                <GoogleCalendarIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight flex items-center gap-2">
                    Add to Google Calendar
                    {field.value && (
                      <Badge variant="secondary" className="text-xs py-0">
                        <CalendarCheck2 className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Creates a calendar event when this task is saved
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="shrink-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Edit actions */}
        {isEditing && (
          <div className="flex items-center gap-2 pt-1">
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </form>
    </FormComp>
  );
}
