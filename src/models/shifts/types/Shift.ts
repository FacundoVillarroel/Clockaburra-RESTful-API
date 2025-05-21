export default interface Shift {
  userId: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  startTime: string;
  breaks: {breakStart:string, breakEnd:string}[]
}