'use strict';

/** Class representing selected users for sending personal message view */
class PersonalUsersView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId, clickCallback) {
    this.elem = document.getElementById(containerId);
    this.clickCallback = clickCallback;

    this.temp = {
      user: `
        <li class="active-user__elem">{Username}</li>
      `,
    };
  }

  /**
   * Display user list in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {Array.<String>} [users = []] - user list
   */
  display(users = []) {
    const { temp, clickCallback } = this;
    let HTMLContent = '';
    users?.forEach(item => {
      HTMLContent += temp.user.replace('{Username}', item);
    })
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent);

    this.elem.addEventListener('click', clickCallback);
  }
}

export default PersonalUsersView;