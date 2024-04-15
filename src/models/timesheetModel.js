class Timesheet {
  constructor(userId, startDate, expectedHours = null) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = null;
    this.expectedHours = expectedHours;
    this.workedHours = null;
    this.breaks = []; // [{actionType, timeStamp}]
    this.actionHistory = [{ actionType: "in", timeStamp: startDate }]; //[{actionType:"checkIn", timeStamp:15550, {actionType:"breakStart", timeStamp:22000}}]
    this.approved = false;
    this.rejected = false;
  }
}

export default Timesheet;
