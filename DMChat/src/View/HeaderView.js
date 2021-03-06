'use strict';

/** Class representing header view */
class HeaderView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   * @param {Function} containerId - index.html element id
   */
  constructor(containerId, signCallback) {
    this.elem = document.getElementById(containerId);
    this.signCallback = signCallback;
    this.temp = {
      userHTML: `
        <span class="nav__user-name">{UserName}</span>
        <a href="#" data-action="runSignOut" class="nav__link">Выйти</a>
      `,
      chatHTML: `
        <a href="#" data-action="runChat" class="nav__link {ClassMain}">Главная</a>
      `,
      signHTML: `
        <a href="#" data-action="runSignIn" class="nav__link {ClassAuth}">Авторизация</a>
        <a href="#" data-action="runSignUp" class="nav__link {ClassReg}">Регистрация</a>
      `
    }
  }

  /**
   * Display header (navigation, username) in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {string} [activePage = 'Main'] - active page name
   */
  display(activeUser, activePage = 'chat') {
    const { temp, elem, signCallback } = this;
    let HTMLContent = activeUser ? temp.userHTML.replace('{UserName}', activeUser) :
      (temp.chatHTML + temp.signHTML)
        .replace('{ClassMain}', activePage === 'chat' ? 'nav__link_active' : '')
        .replace('{ClassAuth}', activePage === 'sign-in' ? 'nav__link_active' : '')
        .replace('{ClassReg}', activePage === 'sign-up' ? 'nav__link_active' : '');
    if (activeUser && activePage === 'error') {
      HTMLContent = temp.chatHTML + HTMLContent;
    }
    elem.innerHTML = '';
    elem.insertAdjacentHTML('beforeend', HTMLContent);
    elem.addEventListener('click', signCallback);
  }
}

export default HeaderView;
