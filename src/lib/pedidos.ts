const DAY_MS = 24 * 60 * 60 * 1000;

function calendarDay(timestamp: number) {
  const d = new Date(timestamp);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysFrozen(createdAt: string, finalizedAt: string | null, status: string) {
  const end = status === "finalizado" && finalizedAt ? new Date(finalizedAt).getTime() : Date.now();
  const start = new Date(createdAt).getTime();
  return Math.max(0, Math.round((calendarDay(end) - calendarDay(start)) / DAY_MS));
}

const HOUR_MS = 60 * 60 * 1000;

export function hoursRemaining(createdAt: string, totalHours: number) {
  const elapsedMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, totalHours - elapsedMs / HOUR_MS);
}
