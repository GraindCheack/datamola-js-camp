'use strict';

/** Class representing active users view. */
class ActiveUsersView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   * @param {Function} clickCallback - callback on active user item click
   */
  constructor(containerId, clickCallback) {
    this.elem = document.getElementById(containerId);
    this.clickCallback = clickCallback;

    this.temp = `
      <li class="active-user__elem">{Username}</li>
    `;
  }

  /**
   * Display active user list in index.html
   * 
   * @param {Array.<String>} [users = []] - users list 
   */
  display(users = []) {
    const { temp, elem, clickCallback } = this;
    let HTMLContent = '';
    users?.forEach(item => {
      HTMLContent += temp.replace('{Username}', item);
    })
    elem.innerHTML = '';
    elem.insertAdjacentHTML('beforeend', HTMLContent);

    elem.addEventListener('click', clickCallback);
  }
}

export default ActiveUsersView;