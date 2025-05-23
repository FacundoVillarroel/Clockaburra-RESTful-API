export default interface Shift {
  userId: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  breaks: { breakStart: string; breakEnd: string }[];
}