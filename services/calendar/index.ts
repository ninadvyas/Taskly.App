"use server";

interface CalendarEventBody {
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string; timeZone: string };
  end: { dateTime?: string; date?: string; timeZone: string };
}

export async function createCalendarEvent(
  accessToken: string,
  title: string,
  description: string,
  dueDate?: string
): Promise<string | null> {
  try {
    const timeZone = "UTC";
    let eventBody: CalendarEventBody;

    if (dueDate) {
      // Use the due date as an all-day event if it's just a date, or a timed event
      eventBody = {
        summary: title,
        description: description || "",
        start: { date: dueDate.split("T")[0], timeZone },
        end: { date: dueDate.split("T")[0], timeZone },
      };
    } else {
      // No due date — create a 1-hour event starting now
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000);
      eventBody = {
        summary: title,
        description: description || "",
        start: { dateTime: now.toISOString(), timeZone },
        end: { dateTime: end.toISOString(), timeZone },
      };
    }

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!res.ok) {
      console.error("Google Calendar createEvent error:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.id as string;
  } catch (err) {
    console.error("createCalendarEvent failed:", err);
    return null;
  }
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  try {
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (err) {
    console.error("deleteCalendarEvent failed:", err);
  }
}

export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  title: string,
  description: string,
  dueDate?: string
): Promise<void> {
  try {
    const timeZone = "UTC";
    let patch: Partial<CalendarEventBody> = {
      summary: title,
      description: description || "",
    };

    if (dueDate) {
      patch.start = { date: dueDate.split("T")[0], timeZone };
      patch.end = { date: dueDate.split("T")[0], timeZone };
    }

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      }
    );
  } catch (err) {
    console.error("updateCalendarEvent failed:", err);
  }
}
