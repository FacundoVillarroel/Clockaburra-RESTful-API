const { DateTime } = require("luxon");

const calculateWorkedHours = (start, end, breaks) => {
  const startDateTime = DateTime.fromISO(start);
  const endDateTime = DateTime.fromISO(end);
  let totalBreakTime = 0;

  let breakStart = null;
  breaks.forEach((brk) => {
    if (brk.actionType === "breakStart") {
      breakStart = DateTime.fromISO(brk.timeStamp);
    } else if (brk.actionType === "breakEnd" && breakStart) {
      const breakEnd = DateTime.fromISO(brk.timeStamp);
      const breakDuration = breakEnd.diff(breakStart, "hours").hours;
      totalBreakTime += breakDuration;
      breakStart = null;
    }
  });

  const diff = endDateTime.diff(startDateTime, "hours");
  const workedHours = diff.hours + diff.minutes / 60 - totalBreakTime;

  return workedHours;
};

const isValidDate = (dateString) => {
  const dateTime = DateTime.fromISO(dateString, { zone: "utc" });
  return dateTime.isValid;
};

module.exports = { calculateWorkedHours, isValidDate };
