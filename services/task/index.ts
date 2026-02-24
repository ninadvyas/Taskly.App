"use server";

import { FormSchema } from "@/components/form/schema";
import prisma from "@/lib/prisma";
import { Task } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
} from "@/services/calendar";

function revalidatePageData() {
  revalidatePath("/", "layout");
}

async function getAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  });
  if (!account) return null;

  // Token still valid — return it directly
  const nowSec = Math.floor(Date.now() / 1000);
  if (account.access_token && account.expires_at && account.expires_at > nowSec) {
    return account.access_token;
  }

  // Token expired — attempt refresh
  if (!account.refresh_token) {
    console.warn("No refresh_token stored for user:", userId);
    return null;
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
    });
    if (!res.ok) {
      console.error("Token refresh failed:", await res.text());
      return null;
    }
    const json = await res.json();
    await prisma.account.updateMany({
      where: { userId, provider: "google" },
      data: {
        access_token: json.access_token,
        expires_at: Math.floor(Date.now() / 1000) + (json.expires_in ?? 3600),
      },
    });
    return json.access_token as string;
  } catch (err) {
    console.error("getAccessToken refresh error:", err);
    return null;
  }
}


export async function createTask(task: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  let googleEventId: string | null = null;

  if (task.syncToCalendar && userId) {
    const accessToken = await getAccessToken(userId);
    if (accessToken) {
      googleEventId = await createCalendarEvent(
        accessToken,
        task.title,
        task.description || "",
        task.dueDate
      );
    }
  }

  await prisma.task.create({
    data: {
      description: task.description || "",
      status: task.status,
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      googleEventId,
      userId: userId ?? null,
    },
  });
  revalidatePageData();
}

export async function getTasks() {
  const session = await auth();
  const userId = session?.user?.id;

  const tasks = await prisma.task.findMany({
    where: userId ? { userId } : {},
    orderBy: { createdAt: "desc" },
  });
  return tasks;
}

export async function deleteTask(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  const task = await prisma.task.findUnique({ where: { id } });

  if (task?.googleEventId && userId) {
    const accessToken = await getAccessToken(userId);
    if (accessToken) {
      await deleteCalendarEvent(accessToken, task.googleEventId);
    }
  }

  await prisma.task.delete({ where: { id } });
  revalidatePageData();
}

export async function updateTask(task: Task, syncToCalendar: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  let googleEventId = task.googleEventId;

  if (userId) {
    const accessToken = await getAccessToken(userId);
    if (accessToken) {
      if (syncToCalendar && googleEventId) {
        // Already synced — patch the existing event
        await updateCalendarEvent(
          accessToken,
          googleEventId,
          task.title,
          task.description,
          task.dueDate?.toISOString()
        );
      } else if (syncToCalendar && !googleEventId) {
        // Newly enabling sync — create a calendar event
        googleEventId = await createCalendarEvent(
          accessToken,
          task.title,
          task.description,
          task.dueDate?.toISOString()
        );
      } else if (!syncToCalendar && googleEventId) {
        // Disabling sync — delete the calendar event and clear the id
        await deleteCalendarEvent(accessToken, googleEventId);
        googleEventId = null;
      }
    }
  }

  await prisma.task.update({
    where: { id: task.id },
    data: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      googleEventId,
    },
  });
  revalidatePageData();
}

export async function getTaskCountByStatus() {
  const session = await auth();
  const userId = session?.user?.id;
  const where = userId ? { userId } : {};

  const [starting, progress, done] = await Promise.all([
    prisma.task.count({ where: { ...where, status: "starting" } }),
    prisma.task.count({ where: { ...where, status: "progress" } }),
    prisma.task.count({ where: { ...where, status: "done" } }),
  ]);
  return { starting, progress, done };
}

// Shared UTC date label so server timezone never affects grouping
function utcDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function getTasksCreatedPerDay(): Promise<{ date: string; count: number }[]> {
  const session = await auth();
  const userId = session?.user?.id;

  // Not signed in → return zero-filled array (no data leakage)
  if (!userId) {
    const empty: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      empty.push({ date: utcDateLabel(d), count: 0 });
    }
    return empty;
  }

  // Build last-7-days date range using UTC to stay consistent with DB
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push({ date: utcDateLabel(d), count: 0 });
  }

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 6);
  since.setUTCHours(0, 0, 0, 0);

  const tasks = await prisma.task.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  for (const task of tasks) {
    const label = utcDateLabel(new Date(task.createdAt));
    const entry = days.find((d) => d.date === label);
    if (entry) entry.count++;
  }

  return days;
}

export async function getRecentTasks(limit = 8) {
  const session = await auth();
  const userId = session?.user?.id;
  // Not signed in → return nothing
  if (!userId) return [];
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
