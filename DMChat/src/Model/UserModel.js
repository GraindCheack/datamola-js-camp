'use strict';

/** Class representing users information. */
class UserList {
  /**
   * Create class object.
   * @param {Array.<Message>} [users = []] - all users list
   * @param {Array.<Message>} [activeUsers = []] - active (online) users list
   */
  constructor(users = [], activeUsers = []) {
    this.users = users;
    this.activeUsers = activeUsers;
    this.personalUsers = [];
  }
}

export default UserList;