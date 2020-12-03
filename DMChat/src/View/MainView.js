'use strict';

class MainView {
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
              <input type="time" name="timeFrom" class="filter-form__input-date">
              <p>До "дата/время"</p>
              <input type="date" name="dateTo" class="filter-form__input-date">
              <input type="time" name="timeTo" class="filter-form__input-date">
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
          <div id="{ID}" class="message chat__message message_style_autres">
            <img src="./images/message-autres.svg" alt="message" class="message__background_autres">
            <div class="message__content">
              <h4 class="message__name message__name_admin">DMChat</h4>
              <div class="message__text">Добро пожаловать!<br>Введи логин и пароль:</div>
              <div class="message__date message__date_autres">30.11.2020 12:45</div>
            </div>
          </div>
          <div class="sign-form__content">
            <input type="text" class="sign-form__input" name="username" id="sign-form__name" placeholder="Логин" required>
            <input type="password" class="sign-form__input" name="password" id="sign-form__password" placeholder="Пароль" required>
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
              <div class="message__text">Давай регистрировтаься!<br>Введи логин и двжады пароль:</div>
              <div class="message__date message__date_autres">30.11.2020 12:45</div>
            </div>
          </div>
          <div class="sign-form__content">
            <input type="text" class="sign-form__input" name="username" id="sign-form__name" placeholder="Логин" required>
            <input type="password" class="sign-form__input" name="password" id="sign-form__password" placeholder="Пароль" required>
            <input type="password" class="sign-form__input" name="password" id="sign-form__password_double" placeholder="Подтвердите пароль" required>
            <button type="submit" class="sign-form__btn">Регистрация <img src="./images/arrow-right.svg" alt="Next" class="sign-form__btn-img"></button>
            <button type="reset" class="sign-form__reset-btn"><img src="./images/clean.svg" alt="Clean"></button>
          </div>
        </form>
      `
    }
  }

  display(page = 'chat') {
    const { elem } = this;
    const { signInCallback, signUpCallback, filterSubmitCallback, filterResetCallback } = this.callback;
    const { chatHTML, signInHTML, signUpHTML } = this.temp;
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