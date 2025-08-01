import type TimesheetAction from "../models/timesheets/types/TimesheetAction";

type Break = {
  breakStart:string, 
  breakEnd:string
}

export const createTimesheetActionHistory = (startDate: string, breaks:Break[], endDate:string) : TimesheetAction[] => {
  // Create an empty array to store the history of actions
  const actionHistory = [];

  // Add the check-in action to the beginning of the history
  actionHistory.push({ actionType: "checkIn", timeStamp: startDate });

  // Iterate over the breaks array and add the corresponding actions
  breaks.forEach((b) => {
    actionHistory.push({ actionType: "breakStart", timeStamp: b.breakStart });
    actionHistory.push({ actionType: "breakEnd", timeStamp: b.breakEnd });
  });

  // Add check-out action to the end of history
  actionHistory.push({ actionType: "checkOut", timeStamp: endDate });

  return actionHistory;
};
