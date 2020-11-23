'use strict';

/** Class representing messages view */
class MessagesView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId) {
    this.elem = document.getElementById(containerId);
    this.msgs = [];

    this.temp = {
      autres: `
        <article id="{ID}" class="message chat__message message_style_autres {ClassName}">
          <img src="./images/message-{Image}.svg" alt="message" class="message__background_autres {BckClassName}">
          <div class="message__content">
            <h4 class="message__name">{Username}</h4>
            <div class="message__text">{Text}</div>
            <div class="message__date">{Date}</div>
          </div>
        </article>

      `,
      user: `
        <article id="{ID}" class="message chat__message message_style_user {ClassName}">
          <img src="./images/message-{Image}.svg" alt="message" class="message__background_user {BckClassName}">
          <div class="message__content">
            <div class="message__head">
              <h4 class="message__name">{Username}</h4>
              <div class="message-control">
                <img src="./images/delete.svg" alt="Delete" class="message-control__image">
                <img src="./images/edit.svg" alt="Edit" class="message-control__image">
              </div>
            </div>
            <div class="message__text">{Text}</div>
            <div class="message__date">{Date}</div>
          </div>
        </article>
      `,
      msgForm: `
        <form class="mesage-form">
          <input type="text" name="message" class="mesage-form__input" placeholder="Введите сообщение">
          <button type="submit" class="mesage-form__button"><img src="./images/send.svg" alt="Send"></button>
        </form>
      `,
      loadBtn: `
        <div class="chat__load-button"><button>Загрузить ещё</button></div>
      `
    }
  }

  /**
   * Add message object
   *
   * @param {Message} msg - Message class object
   * @param {string} activeUser - active user name
   */
  addMessage(msg, activeUser) {
    this.msgs.push(msg);
    this.display(activeUser);
  }

  /**
   * Edit message object
   *
   * @param {string} id - message id
   * @param {Message} msg - Message class object
   * @param {string} activeUser - active user name
   */
  editMessage(id, msg, activeUser) {
    const placeId = this.msgs.findIndex(item => item.id === id);
    this.msgs[placeId] = msg;
    this.display(activeUser);
  }

  /**
   * Remove message object from messages list
   *
   * @param {string} id - message id
   * @param {string} activeUser - active user name
   */
  removeMessage(id, activeUser) {
    const placeId = this.msgs.findIndex(item => item.id === id);
    this.msgs.splice(placeId, 1);
    this.display(activeUser);
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
      .replace('{Date}', createdAt.toLocaleDateString('ru', dateOption));
  }

  /**
   * Display messages in index.html
   * 
   * @param {string} activeUser - active user name
   * @param {Array.<Message>} [msgs = []] - additional/new message list
   * @param {boolean} [isEnd = false] - if the last messages
   * @param {boolean} [isEnd = false] - if to replace last messages
   */
  display(activeUser, msgs = [], isEnd = false, isReplace = false) {
    let HTMLContent = `
      <div class="message-list">
    `;
    const { temp } = this;
    let newMsgs = [];
    if (!isEnd) {
      HTMLContent += temp.loadBtn;
    }
    if (isReplace) {
      this.msgs = msgs;
      newMsgs = msgs;
    } else {
      newMsgs = [...this.msgs, ...msgs];
    }
    newMsgs.forEach(item => HTMLContent += this.getHTMlByMsg(item, activeUser));
    HTMLContent += '</div>';
    if (activeUser) {
      HTMLContent += temp.msgForm;
    }
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent);
  }
}

export default MessagesView;