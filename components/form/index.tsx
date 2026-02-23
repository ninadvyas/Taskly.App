"use client";

import React, { useState } from "react";
import { VscLoading } from "react-icons/vsc";
import {
  Form as FormComp,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { IoAddOutline } from "react-icons/io5";
import { createTask, deleteTask, updateTask } from "@/services/task";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@prisma/client";
import { Switch } from "../ui/switch";
import { TaskPriority } from "./schema";
import { useSession } from "next-auth/react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  task?: Task;
  onSubmitOrDelete?: () => void;
};

// Google Calendar icon — matches the real GCal app icon style
function GoogleCalendarIcon() {
  const today = new Date();
  const day = today.getDate();
  return (
    <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-gray-200 flex flex-col bg-white shadow-sm select-none">
      {/* Top colour bar (4-segment like the real icon) */}
      <div className="flex h-[5px]">
        <div className="flex-1 bg-[#4285F4]" />
        <div className="flex-1 bg-[#EA4335]" />
        <div className="flex-1 bg-[#FBBC05]" />
        <div className="flex-1 bg-[#34A853]" />
      </div>
      {/* Date number */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[15px] font-semibold text-gray-800 leading-none">{day}</span>
      </div>
      {/* Bottom: mini Google G */}
      <div className="flex items-center justify-start px-[5px] pb-[3px]">
        <svg viewBox="0 0 10 10" className="h-[8px] w-[8px]">
          <path d="M9.5 5.1c0-.35-.03-.68-.09-1H5v1.89h2.52A2.16 2.16 0 0 1 6.44 7.3v1.04h1.5C8.9 7.6 9.5 6.47 9.5 5.1z" fill="#4285F4" />
          <path d="M5 9.5c1.34 0 2.46-.44 3.28-1.2L6.78 7.28c-.44.3-1.01.47-1.78.47-1.37 0-2.53-.93-2.95-2.17H.73v1.08A4.5 4.5 0 0 0 5 9.5z" fill="#34A853" />
          <path d="M2.05 5.58A2.7 2.7 0 0 1 1.91 5c0-.2.03-.4.08-.58V3.34H.73A4.5 4.5 0 0 0 .5 5c0 .73.17 1.42.47 2.04l1.08-.83z" fill="#FBBC05" />
          <path d="M5 2.25c.77 0 1.46.27 2 .79l1.5-1.5A4.47 4.47 0 0 0 5 .5 4.5 4.5 0 0 0 .73 3.34l1.32 1.08C2.47 3.18 3.63 2.25 5 2.25z" fill="#EA4335" />
        </svg>
      </div>
    </div>
  );
}



export default function Form(props: Props) {
  const { task, onSubmitOrDelete } = props;
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
          ? new Date(task.dueDate as unknown as Date)
            .toISOString()
            .split("T")[0]
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

  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    if (!isEditing) {
      await createTask(data);
    } else {
      const newTask = {
        id: task.id,
        createdAt: task.createdAt,
        description: data.description || "",
        status: data.status,
        title: data.title,
        priority: data.priority || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        googleEventId: task.googleEventId,
        userId: task.userId,
      } as Task;
      await updateTask(newTask, data.syncToCalendar ?? false);
    }
    setIsLoading(false);
    toast({
      title: isEditing
        ? "Task updated successfully!"
        : "New task created successfully!" +
        (data.syncToCalendar ? " Added to Google Calendar." : ""),
    });
    onSubmitOrDelete?.();
  };

  const onDelete = async () => {
    if (!task?.id) return;
    await deleteTask(task.id);
    onSubmitOrDelete?.();
  };

  return (
    <FormComp {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <FormControl>
                  <Input placeholder="What's happening?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* Row 1: Title + Status + Add button */}
        <div className="flex items-start gap-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormMessage />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      <span className="text-emerald-500 font-medium">Low</span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="text-amber-500 font-medium">Medium</span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="text-red-500 font-semibold">High</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => {
              const selectedDate = field.value ? new Date(field.value) : undefined;
              return (
                <FormItem className="flex flex-col">
                  <Popover>
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
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />
          {!isEditing && (
            <Button
              type="submit"
              icon={
                isLoading ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  <IoAddOutline />
                )
              }
            >
              Add Task
            </Button>
          )}
        </div>

        {/* Row 2: Description + Due Date */}
        <div className="flex gap-3 items-start">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grow">
                <FormMessage />
                <FormControl>
                  <Textarea
                    placeholder="Give more information about the task"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Calendar sync toggle (only for signed-in users) */}
        {isSignedIn && (
          <FormField
            control={form.control}
            name="syncToCalendar"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-lg border px-4 py-3 bg-muted/40">
                <div className="self-center">
                  <GoogleCalendarIcon />
                </div>
                <div className="flex-1">
                  <FormLabel className="cursor-pointer text-sm font-medium leading-tight">
                    Add to Google Calendar
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Creates a calendar event when this task is saved
                  </p>
                </div>
                <FormControl>
                  <Switch
                    className="self-center mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Editing actions */}
        {isEditing && (
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        )}
      </form>
    </FormComp>
  );
}
