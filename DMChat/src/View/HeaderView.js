'use strict';

/** Class representing header view */
class HeaderView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId) {
    this.elem = document.getElementById(containerId);
    this.temp = {
      isAuth: `
        <span class="nav__user-name">{UserName}</span>
        <a href="#" class="nav__link">Выйти</a>
      `,
      notAuth: `
        <a href="#" class="nav__link {ClassMain}">Главная</a>
        <a href="#" class="nav__link {ClassAuth}">Авторизация</a>
        <a href="#" class="nav__link {ClassReg}">Регистрация</a>
      `
    }
  }

  /**
   * Display header (navigation, username) in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {string} [activePage = 'Main'] - active page name
   */
  display(activeUser, activePage = 'Main') {
    const { temp } = this;
    const HTMLContent = activeUser ? temp.isAuth.replace('{UserName}', activeUser) :
      this.temp.notAuth
        .replace('{ClassMain}', activePage === 'Main' ? 'nav__link_active' : '')
        .replace('{ClassAuth}', activePage === 'Auth' ? 'nav__link_active' : '')
        .replace('{ClassReg}', activePage === 'Reg' ? 'nav__link_active' : '');
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent);
  }
}

export default HeaderView;
