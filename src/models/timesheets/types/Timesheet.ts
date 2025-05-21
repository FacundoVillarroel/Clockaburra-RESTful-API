
import type TimesheetAction from "./TimesheetAction";

type Break ={
  breakStart: string;
  breakEnd: string;
}

export interface Timesheet {
  actionHistory: TimesheetAction[];
  approved: boolean;
  breaks: Break[]
  endDate: string;
  expectedHours: number | null;
  id: string;
  rejected: boolean;
  startDate: string;
  userId: string;
  workedHours: number;
}