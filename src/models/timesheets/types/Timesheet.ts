
import type TimesheetAction from "./TimesheetAction";

type Break = {
  breakStart: string;
  breakEnd: string | null;
};

export default interface Timesheet {
  actionHistory: TimesheetAction[];
  approved: boolean;
  breaks: Break[];
  endDate: string | null;
  expectedHours: number | null;
  id?: string;
  rejected: boolean;
  startDate: string;
  userId: string;
  workedHours: number | null;
}