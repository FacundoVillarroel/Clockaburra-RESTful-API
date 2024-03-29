class Timesheet {
  constructor(
    userId,
    startDate,
    endDate,
    expectedHours,
    workedHours,
    breaks,
    actionHistory
  ) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.expectedHours = expectedHours;
    this.workedHours = workedHours;
    this.breaks = breaks; //{start, end}
    this.actionHistory = actionHistory; //[{actionType:"CheckIn", timeStamp:15550, {actionType:"breakStart", timeStamp:22000}}]
    this.approved = false;
  }
}
export default Timesheet;
