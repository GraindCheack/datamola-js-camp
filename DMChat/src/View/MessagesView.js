'use strict';

/** Class representing messages view */
class MessagesView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   * @param {Function} sendingMsgCallback - callback on message form submit
   * @param {Function} msgControlCallback - callback on message block click
   * @param {Function} resetFormCallback - callback on form reset button click
   */
  constructor(containerId, sendingMsgCallback, msgControlCallback, resetFormCallback) {
    this.elem = document.getElementById(containerId);
    this.isFirstLoad = true;
    this.callback = {
      sendingMsgCallback: sendingMsgCallback,
      msgControlCallback: msgControlCallback,
      resetFormCallback: resetFormCallback,
    };

    this.temp = {
      autres: `
        <article id="{ID}" class="message chat__message message_style_autres {ClassName}">
          <img src="./images/message-{Image}.svg" alt="message" class="message__background_autres {BckClassName}">
          <div class="message__content">
            <h4 class="message__name">{Username}</h4>
            <div class="message__text">{Text}</div>
            <div class="message__date message__date_autres">{Date}</div>
          </div>
        </article>

      `,
      user: `
        <article id="{ID}" class="message chat__message message_style_user {ClassName}" {Selector}>
          <img src="./images/message-{Image}.svg" alt="message" class="message__background_user {BckClassName}">
          <div class="message__content">
            <div class="message__head">
              <h4 class="message__name">{Username}</h4>
              <div class="message-control">
                <img src="./images/delete.svg" alt="Delete" data-action="confirmRemove" class="message-control__image">
                <img src="./images/edit.svg" alt="Edit" data-action="edit" class="message-control__image">
              </div>
            </div>
            <div class="message__text">{Text}</div>
            <div class="message__date message__date_user">{Date}</div>
          </div>
        </article>
      `,
      addUserMsgFormCont: `
        <div class="message-form__container">
          <input type="text" name="message__text" class="message-form__input" placeholder="Введите сообщение" autocomplete="off">
        </div>
        <button type="submit" class="message-form__button"><img src="./images/send.svg" alt="Send"></button>
      `,
      addPersonalMsgFormCont: `
        <div class="message-form__container">
          <img src="./images/close.svg" alt="Close" data-action="close" class="message-form__img">
          <input type="text" name="message__text" class="message-form__input" placeholder="Введите личное сообщение">
        </div>
        <button type="submit" class="message-form__button"><img src="./images/send-2.svg" alt="Send"></button>
      `,
      editMsgFormCont: `
        <div class="message-form__container">
          <img src="./images/close.svg" alt="Close" data-action="close" class="message-form__img">
          <input type="text" name="message__text" class="message-form__input" autocomplete="off" value="{Value}">
        </div>
        <button type="submit" class="message-form__button"><img src="./images/send.svg" alt="Send"></button>
      `,
      loadBtn: `
        <div class="chat__load-button"><button data-action="showMore">Загрузить ещё</button></div>
      `,
      messageControlDefault: `
        <img src="./images/delete.svg" alt="Delete" data-action="confirmRemove" class="message-control__image">
        <img src="./images/edit.svg" alt="Edit" data-action="edit" class="message-control__image">
      `,
      messageControlConfirm: `
        <img src="./images/check.svg" alt="Delete" data-action="remove" class="message-control__image">
        <img src="./images/close.svg" alt="Edit" data-action="closeConfirm" class="message-control__image">
      `
    }
  }

  /**
   * Reset message controls to default state
   *
   * @param {Node} elem - control block element
   */
  resetMessageControls(elem) {
    const { messageControlDefault } = this.temp;
    elem.innerHTML = messageControlDefault;
  }

  /**
   * Display confirm action controls
   *
   * @param {Node} elem - control block element
   */
  confirmRemoveControl(elem) {
    const { messageControlConfirm } = this.temp;
    elem.innerHTML = messageControlConfirm;
  }

  /**
   * Get message HTML string, example <div...
   *
   * @param {Message} msg - message object, supports:
   *    {string} id - message unique id
   *    {string} text - message text
   *    {string} author - message author name
   *    {Date} createdAt - message creation date
   *    {string} [to] - message recipient name
   *    {boolean} isPersonal - if personal message
   * @param {string} activeUser - active user name
   */
  getHTMlByMsg(msg, activeUser) {
    const { temp } = this;
    const { text, isPersonal, author, createdAt, to, id } = msg;
    const isAuthor = activeUser === author;
    if (!isAuthor && isPersonal && to !== activeUser) return '';
    const dateOption = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const newMessageHTML = isAuthor ? temp.user : temp.autres;
    return newMessageHTML
      .replace('{ID}', id)
      .replace('{Text}', text)
      .replace('{Image}', isPersonal ? 'personal' : isAuthor ? 'user' : 'autres')
      .replace('{BckClassName}', isPersonal && author !== activeUser ? 'message__background_personal' : '')
      .replace('{ClassName}', isPersonal ? 'message_style_personal ' : '')
      .replace('{Username}', isAuthor && isPersonal ? `${author} - ${to}` : author)
      .replace('{Selector}', isPersonal ? `data-to="${to}"` : '')
      .replace('{Date}', (new Date(createdAt)).toLocaleString(undefined, dateOption));
  }

  /**
   * Display message form
   *
   * @param {Function} callback - callback on form click
   * @param {string} [formType = 'addUserMsg'] - type name of message form
   * @param {string} [value = ''] - value in form input element
   */
  setFormElem(callback, formType = 'addUserMsg', value = '') {
    const { elem, temp } = this;
    const { resetFormCallback } = this.callback;
    const formContHTML = temp[`${formType}FormCont`]
      .replace('{Value}', value);

    const lastFormElem = document.forms['message-form'];
    if (lastFormElem) {
      const formParent = lastFormElem.closest('div');
      formParent.removeChild(lastFormElem);
    }

    const formElem = document.createElement('form');
    formElem.name = 'message-form';

    formElem.classList.add('message-form');
    formElem.insertAdjacentHTML('beforeend', formContHTML);
    elem.insertAdjacentElement('afterend', formElem);

    formElem.addEventListener('submit', callback);
    if (formType === 'editMsg' || formType === 'addPersonalMsg') {
      formElem.addEventListener('click', resetFormCallback);
    }
  }

  /**
   * Display messages in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {Array.<Message>} [msgs = []] - additional/new message list
   * @param {boolean} [isEnd = false] - if the last messages
   */
  display(activeUser, msgs = [], isEnd = false) {
    const { temp, elem, isFirstLoad } = this;
    const { msgControlCallback, sendingMsgCallback } = this.callback;

    let HTMLContent = ``;
    if (!isEnd) {
      HTMLContent += temp.loadBtn;
    }
    msgs.forEach(item => HTMLContent += this.getHTMlByMsg(item, activeUser));

    elem.innerHTML = '';
    elem.insertAdjacentHTML('beforeend', HTMLContent);
    elem.addEventListener('click', msgControlCallback);
    if (isFirstLoad) {
      elem.scrollTop = elem.scrollHeight;
      this.isFirstLoad = false;
      if (activeUser) {
        this.setFormElem(sendingMsgCallback);
      }
    }
  }
}

export default MessagesView;