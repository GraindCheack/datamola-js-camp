'use strict';

/** Class representing page view */
class MainView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   * @param {Function} signInCallback - callback on sign in form submit
   * @param {Function} signUpCallback - callback on sign up form submit
   * @param {Function} filterSubmitCallback - callback on filter form submit
   * @param {Function} filterResetCallback - callback on filter form reset
   */
  constructor(containerId, signInCallback, signUpCallback, filterSubmitCallback, filterResetCallback) {
    this.elem = document.getElementById(containerId);
    this.callback = {
      signInCallback: signInCallback,
      signUpCallback: signUpCallback,
      filterSubmitCallback: filterSubmitCallback,
      filterResetCallback: filterResetCallback,
    }

    this.temp = {
      chatHTML: `
        <img src="./images/phone-mess.svg" alt="Phone with messages" class="main__image_chat">
        <section class="chat">
          <form class="filter-form" name="filter">
            <input type="text" name="author" class="filter-form__input-text" placeholder="Логин" autocomplete="off">
            <label for="hide-date" class="filter-form__item filter-form__item_date"> <img src="./images/calendar.svg" alt="Calendar"></label>
            <input type="checkbox" name="hide-input" id="hide-date" class="filter-form__input_checkbox">
            <div class="filter-form__input-cont">
              <p>От "дата/время"</p>
              <input type="date" name="dateFrom" class="filter-form__input-date">
              <p>До "дата/время"</p>
              <input type="date" name="dateTo" class="filter-form__input-date">
            </div>
            <input type="text" name="text" class="filter-form__input-text filter-form__item" placeholder="Текст" autocomplete="off">
            <button type="reset" class="filter-form__button"><img src="./images/clean.svg" alt="Clean" class="filter-form__image"></button>
            <button type="submit" class="filter-form__button"><img src="./images/plus.svg" alt="add" class="filter-form__image"></button>
          </form>
          <div id="filter-select-list"></div>
          <div id="chat__content">
            <div class="message-list" id="message-list"></div>
          </div>
        </section>
        <aside class="chat-users">
          <div class="active-user">
            <div class="chat-users__head">Список активных пользователей:</div>
            <ul class="user__list" id="active-user__list"> 
            </ul>
          </div>
          <div class="person-message">
            <div class="chat-users__head">Личное сообщение для:</div>
            <ul class="user__list" id="personal-user__list"></ul>
          </div>
        </aside>
      `,
      signInHTML: `
        <img src="./images/sign.svg" alt="Chat" class="main__image_sign">
        <form action="" class="sign-form" id="sign-form" name="sign">
          <div class="message chat__message message_style_autres">
            <img src="./images/message-autres.svg" alt="message" class="message__background_autres">
            <div class="message__content">
              <h4 class="message__name message__name_admin">DMChat</h4>
              <div class="message__text">Добро пожаловать!<br>Введи логин и пароль:</div>
              <div class="message__date message__date_autres">...</div>
            </div>
          </div>
          <div class="sign-form__content">
            <input type="text" class="sign-form__input" name="name" id="sign-form__name" placeholder="Логин" required>
            <input type="password" class="sign-form__input" name="pass" id="sign-form__password" placeholder="Пароль" required>
            <input type="checkbox" name="error-hide" class="sign-form__checkbox sign-form__input_hidden">
            <label for="error-hide" class="sign-form__text sign-form__text_error" id="sign-form__error"></label>
            <button type="submit" class="sign-form__btn">Войти <img src="./images/arrow-right.svg" alt="Next" class="sign-form__btn-img"></button>
            <button type="reset" class="sign-form__reset-btn"><img src="./images/clean.svg" alt="Clean"></button>
          </div>
        </form>
      `,
      signUpHTML: `
        <img src="./images/sign.svg" alt="Chat" class="main__image_sign">
        <form action="" class="sign-form" id="sign-form" name="sign">
          <div id="{ID}" class="message chat__message message_style_autres">
            <img src="./images/message-autres.svg" alt="message" class="message__background_autres">
            <div class="message__content">
              <h4 class="message__name message__name_admin">DMChat</h4>
              <div class="message__text">Давай регистрироваться!<br>Введи логин и дважды пароль:</div>
              <div class="message__date message__date_autres">30.11.2020 12:45</div>
            </div>
          </div>
          <div class="sign-form__content">
            <input type="text" class="sign-form__input" name="name" id="sign-form__name" placeholder="Логин" required>
            <input type="password" class="sign-form__input" name="pass" id="sign-form__password" placeholder="Пароль" required>
            <input type="password" class="sign-form__input" name="pass" id="sign-form__password_double" placeholder="Подтвердите пароль" required>
            <input type="checkbox" name="succeful-hide" class="sign-form__checkbox sign-form__input_hidden">
            <label for="succeful-hide" class="sign-form__text sign-form__text_succesful">Регистрация прошла успешно.<br> Перенаправление через 2 секунды</label>
            <input type="checkbox" name="error-hide" class="sign-form__checkbox sign-form__input_hidden">
            <label for="error-hide" class="sign-form__text sign-form__text_error" id="sign-form__error"></label>
            <button type="submit" class="sign-form__btn">Регистрация <img src="./images/arrow-right.svg" alt="Next" class="sign-form__btn-img"></button>
            <button type="reset" class="sign-form__reset-btn"><img src="./images/clean.svg" alt="Clean"></button>
          </div>
        </form>
      `,
      errorHTML: `
        <img src="./images/phone-mess.svg" alt="Phone with messages" class="main__image_error">
        <div class="error">
          <h2 class="error-status">
            <span>{status-1}</span><span>{status-2}</span><span>{status-3}</span>
          </h2>
          <div class="message chat__message message_style_autres">
            <img src="./images/message-autres.svg" alt="message" class="message__background_autres">
            <div class="message__content">
              <h4 class="message__name message__name_admin">DMChat</h4>
              <div class="message__text">Ошибка<br>{Error}</div>
              <div class="message__date message__date_autres">...</div>
            </div>
          </div>
        </div>
      `
    }
  }

  /**
   * Display messages in index.html
   * 
   * @param {string} [page = 'chat'] - page name
   * @param {string} [data = {}] - page data
   */
  display(page = 'chat', data = {}) {
    const { elem } = this;
    const { signInCallback, signUpCallback, filterSubmitCallback, filterResetCallback } = this.callback;
    const { chatHTML, signInHTML, signUpHTML, errorHTML } = this.temp;
    const status = (data.status || '').toString() || '???';
    elem.innerHTML = '';
    switch (page) {
      case 'chat':
        elem.classList.remove('main_h_center');
        elem.insertAdjacentHTML('beforeend', chatHTML);
        break;
      case 'sign-in':
        elem.classList.add('main_h_center');
        elem.insertAdjacentHTML('beforeend', signInHTML);
        break;
      case 'sign-up':
        elem.classList.add('main_h_center');
        elem.insertAdjacentHTML('beforeend', signUpHTML);
        break;
      case 'error':
        elem.classList.add('main_h_center');
        elem.insertAdjacentHTML('beforeend', errorHTML
          .replace('{status-1}', status[0])
          .replace('{status-2}', status[1])
          .replace('{status-3}', status[2])
          .replace('{Error}', data.error)
        );
        break;
    }

    if (page !== 'chat') {
      const signFormElem = document.forms['sign'];
      signFormElem.addEventListener('submit', page === 'sign-in' ? signInCallback : signUpCallback);
    } else {
      const filterFormElem = document.forms['filter'];
      filterFormElem.addEventListener('submit', filterSubmitCallback);
      filterFormElem.addEventListener('reset', filterResetCallback);
    }
  }
}

export default MainView;