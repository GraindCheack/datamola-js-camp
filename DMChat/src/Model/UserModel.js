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
    this.restore();
  }

  save() {
    const { users } = this;
    localStorage.setItem('users', JSON.stringify(users));
  }

  restore() {
    const restoreMsgs = JSON.parse(localStorage.getItem('users'));
    this.users = [
      ...this.users,
      ...restoreMsgs
    ];
  }

  addNewUser(newUser) {
    const { users } = this;

    if (typeof newUser === 'string' && newUser) {
      users.push(newUser);
      this.save();
      return true;
    }
    return false;
  }

  addPersonalUser(newUser) {
    const { personalUsers } = this;

    if (typeof newUser === 'string' && newUser) {
      personalUsers.push(newUser);
      return true;
    }
    return false;
  }

  removePersonalUser(userName) {
    const { personalUsers } = this;
    const id = personalUsers.findIndex(item => item === userName);
    if (id >= 0) {
      personalUsers.splice(id, 1);
      return true;
    }
    return false;
  }
}

export default UserList;