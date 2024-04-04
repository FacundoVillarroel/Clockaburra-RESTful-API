class UsersClockStatus {
  constructor(userId) {
    this.userId = userId;
    this.clockedIn = false;
    this.onBreak = false;
  }
}

export default UsersClockStatus;
