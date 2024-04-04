class Shifts {
  constructor(userId, startDate, endDate, expectedHours, workedHours, breaks) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.expectedHours = expectedHours;
    this.breaks = breaks; //{start, end}
  }
}
export default Shifts;
