class Shifts {
  constructor(userId, startDate, endDate, breaks) {
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.expectedHours = endDate - startDate;
    this.breaks = breaks; //{start, end}
  }
}
export default Shifts;
