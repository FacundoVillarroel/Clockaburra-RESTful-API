import { DateTime } from "luxon";

export const calculateWorkedHours = (start:string, end:string, breaks:{breakStart:string, breakEnd:string}[]) => {
  const startDateTime = DateTime.fromISO(start);
  const endDateTime = DateTime.fromISO(end);
  let totalBreakTime = 0;

  breaks.forEach((brk) => {
    const breakStart = DateTime.fromISO(brk.breakStart);
    const breakEnd = DateTime.fromISO(brk.breakEnd);
    const breakDuration = breakEnd.diff(breakStart, "hours").hours;
    totalBreakTime += breakDuration;
  });

  const diff = endDateTime.diff(startDateTime, "hours");
  const workedHours = diff.hours + diff.minutes / 60 - totalBreakTime;

  return workedHours;
};

export const isValidDate = (dateString: string): boolean => {
  const dateTime = DateTime.fromISO(dateString, { zone: "utc" });
  return dateTime.isValid;
};

