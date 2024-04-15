class Timesheet {
  constructor(userId, startDate, expectedHours = null) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = null;
    this.expectedHours = expectedHours;
    this.workedHours = null;
    this.breaks = { start: [], end: [] };
    this.actionHistory = [{ actionType: "checkIn", timeStamp: startDate }]; //[{actionType:"checkIn", timeStamp:15550, {actionType:"breakStart", timeStamp:22000}}]
    this.approved = false;
    this.rejected = false;
  }

  updateBreak(action, date) {
    switch (action) {
      case "start":
        this.breaks.start.push(date);
        this.addNewAction("breakStart", date);
        break;
      case "end":
        this.breaks.end.push(date);
        this.addNewAction("breakEnd", date);
        break;
      default:
        break;
    }
  }

  addNewAction(actionType, timeStamp) {
    this.actionHistory.push({ actionType, timeStamp });
  }

  save(date) {
    //this.workedHours = logica endDate - startDate - breaks
    this.addNewAction("clockOut", date);
    //guardar en DB
  }

  approveTimesheet() {
    this.approved = true;
    this.rejected = false;
  }

  rejectTimesheet() {
    this.rejected = true;
    this.approved = false;
  }
}

export default Timesheet;
