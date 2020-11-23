'use strict';

/** Class representing selected users for sending personal message view */
class PersonalUsersView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId) {
    this.elem = document.getElementById(containerId);

    this.temp = {
      user: `
        <li class="active-user__elem">{Username}</li>
      `,
      msgForm: `
        <form class="mesage-form person-message__mesage-form">
          <input type="text" name="message" class="mesage-form__input" placeholder="Введите сообщение">
          <button type="submit" class="mesage-form__button"><img src="./images/send-2.svg" alt="Send"></button>
        </form>
      `
    };
  }

  /**
   * Display user list in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {Array.<String>} [users = []] - user list
   */
  display(activeUser, users = []) {
    const { temp } = this;
    let HTMLContent = '';
    users?.forEach(item => {
      HTMLContent += temp.user.replace('{Username}', item);
    })
    if (activeUser) {
      HTMLContent += temp.msgForm;
    }
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent);
  }
}

export default PersonalUsersView;