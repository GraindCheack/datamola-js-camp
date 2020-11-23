'use strict';

/** Class representing active users view. */
class ActiveUsersView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId) {
    this.elem = document.getElementById(containerId);

    this.temp = `
      <li class="active-user__elem">{Username}</li>
    `
  }

  /**
   * Display active user list in index.html
   * 
   * @param {Array.<String>} [users = []] - users list 
   */
  display(users = []) {
    const { temp } = this
    let HTMLContent = '';
    users?.forEach(item => {
      HTMLContent += temp.replace('{Username}', item);
    })
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent)
  }
}

export default ActiveUsersView;