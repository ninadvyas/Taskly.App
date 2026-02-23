"use client"
import { z } from "zod"

const status = z.union([z.literal("starting"), z.literal("progress"), z.literal("done")]).default("starting")
const priority = z.union([z.literal("low"), z.literal("medium"), z.literal("high")]).optional()

const formSchema = z.object({
    title: z.string().min(5).max(60).default(""),
    description: z.string().min(10).max(200).optional(),
    status,
    priority,
    dueDate: z.string().optional(),
    syncToCalendar: z.boolean().optional().default(false),
})

export default formSchema
export type TaskStatus = z.infer<typeof status>
export type TaskPriority = z.infer<typeof priority>
export type FormSchema = z.infer<typeof formSchema>