export default interface Clock {
  clockedIn: boolean;
  currentTimesheetId: string | null;
  id?: string;
  onBreak: boolean;
  userId: string;
}