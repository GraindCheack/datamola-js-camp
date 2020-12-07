'use strict';

import {
  MainView,
  ActiveUsersView,
  FilterView,
  HeaderView,
  MessagesView,
  PersonalUsersView
} from './View/index.js';

import ChatApiService from './ChatApiService.js';

class ChatController {
  constructor() {
    this.views = {
      header: new HeaderView(
        'header',
        (event) => this.handleNavClick(event),
      ),
      main: new MainView(
        'main',
        (event) => this.handleSignInSubmit(event),
        (event) => this.handleSignUpSubmit(event),
        (event) => this.handleFilterSubmit(event),
        (event) => this.handleFilterResetClick(event),
      ),
    };

    this.state = {
      personalUsers: [],
      paginate: 10,
      skip: 0,
      top: 10,
      filter: {},
    }

    this.chatApi = new ChatApiService('https://jslabdb.datamola.com');
  }

  get user() {
    return this._user;
  }

  set user(value) {
    if (typeof value === 'string' && value) {
      this._user = value;
    }
  }

  /**
   * Display error message on the form
   * 
   * @param {Node} form - form element
   * @param {string} text - error message
   */
  _displayErrorOnSignForm(form, text) {
    const errorHideElem = form['error-hide'];
    const errorLabel = errorHideElem.nextElementSibling;

    errorHideElem.checked = true;
    errorLabel.innerHTML = text;
  }

  /** Redirect to chat page */
  runChat() {
    const { user } = this;
    const { main, header } = this.views;
    main.display('chat');

    this.views = {
      ...this.views,
      chat: new MessagesView(
        'message-list',
        (event) => this.handleSendMsgSubmit(event),
        (event) => this.handleMsgControlClick(event),
        (event) => this.handleResetMsgFormElemClick(event)
      ),
      activeUsers: new ActiveUsersView(
        'active-user__list',
        (event) => this.handleActiveUserClick(event),
      ),
      personalUsers: new PersonalUsersView(
        'personal-user__list',
        (event) => this.handlePersonalUserClick(event),
      ),
      filter: new FilterView('filter-select-list'),
    }

    header.display(user, 'chat');
    this.showMessages();
    this.showActiveUsers();
    this.msgTimerId = setTimeout(this.showMessageTimer.bind(this), 8000);
    this.userTimerId = setTimeout(this.showActiveUsersTimer.bind(this), 180000);
    this.showPersonalUsers();
  }

  /** Timer for regulary (8 s) updating messages */
  showMessageTimer() {
    this.showMessages();
    this.msgTimerId = setTimeout(this.showMessageTimer.bind(this), 8000);
  }

  /** Timer for regulary (3 m) updating messages */
  showActiveUsersTimer() {
    this.showActiveUsers();
    this.userTimerId = setTimeout(this.showActiveUsersTimer.bind(this), 180000);
  }

  /**
   * Redirect to error page
   * 
   * @param {number} status - response status
   * @param {string} error - error message
   */
  runError(status, error) {
    const { main, header } = this.views;
    const { user } = this;

    header.display(user, 'error');
    main.display('error', { status, error });
  }

  /** Redirect to sign in page */
  runSignIn() {
    const { main, header } = this.views;
    const { user } = this;

    header.display(user, 'sign-in');
    main.display('sign-in');
  }

  /** Redirect to sign up page */
  runSignUp() {
    const { main, header } = this.views;
    const { user } = this;

    header.display(user, 'sign-up');
    main.display('sign-up');
  }

  /** Sign out and redirect to chat page */
  runSignOut() {
    const { chatApi } = this;

    chatApi.apiSignOut()
      .then((response) => {
        const { status, error } = response;
        if (error) {
          this.runError(status, error);
          return;
        }
        this._user = undefined;
        chatApi.user.token = null;
        this.setCurrentUser();
        this.runChat();
      })
  }

  /** Sign up on submit */
  handleSignInSubmit(event) {
    event.preventDefault();

    const { chatApi } = this;
    const form = event.target;
    const username = form?.name.value;
    const formData = new FormData(form);

    chatApi.apiSignIn(formData)
      .then((response) => {
        const { status, error, token } = response;
        if (error) {
          if (status === 401) {
            this._displayErrorOnSignForm(form, 'Неверный логин или пароль!');
          } else {
            this._displayErrorOnSignForm(form, `${status}: ${error}`);
          }
          return;
        }
        chatApi.user.token = token;
        this.setCurrentUser(username);
        this.runChat();
      })
  }

  /** Sign up on submit */
  handleSignUpSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const { chatApi } = this;
    const pass = form?.pass[0].value;
    const doublePass = form?.pass[1].value;
    const succesShowElem = form['succeful-hide'];
    const errorHideElem = form['error-hide'];

    const formData = new FormData(form);
    if (pass !== doublePass) {
      this._displayErrorOnSignForm(form, 'Пароли не совпадают!');
      return;
    }

    chatApi.apiSignUp(formData)
      .then((response) => {
        const { status, error } = response;
        if (error) {
          if (status === 409) {
            this._displayErrorOnSignForm(form, 'Такой пользователь уже существует')
          } else {
            this._displayErrorOnSignForm(form, `${status}: ${error}`);
          }
          return;
        }
        errorHideElem.checked = false;
        succesShowElem.checked = true;
        setTimeout(() => this.runSignIn(), 2000);
      });

  }

  /** Add message on submit */
  handleSendMsgSubmit(event) {
    event.preventDefault();
    const { personalUsers } = this.state;
    const form = event.target;
    const msg = {
      text: form['message__text'].value,
      isPersonal: false,
    };
    if (personalUsers.length > 0) {
      personalUsers.forEach(item => {
        const tempMsg = {
          ...msg,
          isPersonal: true,
          to: item
        };
        this.addMessage(tempMsg);
      })
    } else {
      this.addMessage(msg);
    }
    form.reset();
  }

  /** Edit message on submit */
  handleEditMsgSubmit(id, to, event) {
    event.preventDefault();
    const { chat } = this.views;
    const form = event.target;
    const msg = {
      text: form['message__text'].value,
      isPersonal: false,
    };
    if (to) {
      msg.isPersonal = true;
      msg.to = to;
    }
    this.editMessage(id, msg);
    chat.setFormElem((event) => this.handleSendMsgSubmit(event));
  }

  /** Add filters on submit */
  handleFilterSubmit(event) {
    event.preventDefault();
    const { filter } = this.state;
    const elem = event.target;
    const { text, author, dateFrom, dateTo } = elem;

    filter.text = text.value || null;
    filter.author = author.value || null;
    filter.dateFrom = dateFrom.value || null;
    filter.dateTo = dateTo.value || null;
    this.views.filter.display(filter);
    this.showMessages();
  }

  /** Redirect to selected page on click */
  handleNavClick(event) {
    event.preventDefault();
    const action = event.target.dataset['action'];
    if (action) {
      this[action]();
    }
  }

  /** Do action (remove/edit/show more messages) on click */
  handleMsgControlClick(event) {
    event.preventDefault();
    const { state } = this;
    const { chat } = this.views;
    const elem = event.target;
    const action = elem.dataset['action'];
    const messageElem = elem.closest('article');
    const text = messageElem ? messageElem.querySelector('.message__text').innerHTML : '';
    const { id } = messageElem || {};
    const to = messageElem ? messageElem.dataset.to : undefined;

    switch (action) {
      case 'closeConfirm':
        chat.resetMessageControls(elem.parentElement);
        break;
      case 'confirmRemove':
        chat.confirmRemoveControl(elem.parentElement);
        break;
      case 'remove':
        this.removeMessage(id);
        break;
      case 'edit':
        state.personalUsers = [];
        this.showPersonalUsers();
        chat.setFormElem(this.handleEditMsgSubmit.bind(this, id, to), 'editMsg', text);
        break;
      case 'showMore':
        state.top += state.paginate;
        this.showMessages();
        break;
    }
  }

  /** Add selected active user to personal list on click */
  handleActiveUserClick(event) {
    event.preventDefault();
    const { user } = this;
    const { chat } = this.views;
    const elem = event.target;
    if (elem.tagName === 'LI' && user) {
      const username = elem.innerHTML;
      this.addPersonalUser(username);
      chat.setFormElem((event) => this.handleSendMsgSubmit(event), 'addPersonalMsg');
    }
  }

  /** Delete selected active user from personal list on click */
  handlePersonalUserClick(event) {
    event.preventDefault();
    const { personalUsers } = this.state;
    const { chat } = this.views;
    const elem = event.target;
    if (elem.tagName === 'LI') {
      const username = elem.innerHTML;
      this.removePersonalUser(username);
      if (personalUsers.length === 0) {
        chat.setFormElem((event) => this.handleSendMsgSubmit(event));
      }
    }
  }

  /** Reset message form on default state on button[type="reset"] click */
  handleResetMsgFormElemClick(event) {
    const { chat } = this.views;
    if (event.target.dataset['action'] === 'close') {
      chat.setFormElem((event) => this.handleSendMsgSubmit(event));
      this.state.personalUsers = [];
      this.showPersonalUsers();
    }
  }

  /** Reset filter form and current filters on click */
  handleFilterResetClick() {
    const { filter, skip, top } = this.state;
    filter.text = null;
    filter.author = null;
    filter.dateFrom = null;
    filter.dateTo = null;
    this.views.filter.display(filter);
    this.showMessages(skip, top, filter);
  }

  /**
   * Set new current user
   * 
   * @param {string} user - new user name
   */
  async setCurrentUser(user) {
    const { state } = this;

    this.user = user;
    state.personalUsers = [];
  }

  /**
   * Add selected user and show new personal list
   *
   * @param {string} user - message object
   */
  addPersonalUser(user) {
    const { personalUsers } = this.state;

    if (!personalUsers.find(item => item === user)) {
      personalUsers.push(user);
      this.showPersonalUsers();
    }
  }

  /**
   * Remove selected user and show new personal list
   *
   * @param {string} user - message object
   */
  removePersonalUser(user) {
    const { personalUsers } = this.state;
    const placeId = personalUsers.findIndex(item => item === user);

    if (placeId >= 0) {
      personalUsers.splice(placeId, 1);
      this.showPersonalUsers();
    }
  }

  /**
   * Add Message
   *
   * @param {object} msg - message object
   */
  addMessage(msg) {
    const { chatApi } = this;

    chatApi.apiCreateMessage(msg)
      .then((response) => {
        const { status, error } = response;
        if (error) {
          if (status === 401) {
            this.runSignIn();
          } else {
            this.runError(status, error);
          }
          return;
        }
        this.showMessages();
      });
  }

  /**
   * Edit Message object by id 
   * @param {string} inputId - Message object unique id
   * @param {object} msg - object with required field to edit Message
   * @return {Boolean} is edited
   */
  editMessage(id, msg) {
    const { chatApi } = this;

    chatApi.apiEditMessage(msg, id)
      .then((response) => {
        const { status, error } = response;
        if (error) {
          if (status === 401) {
            this.runSignIn();
          } else {
            this.runError(status, error);
          }
          return;
        }
        this.showMessages();
      });
  }

  /**
   * Remove Message object by id 
   *
   * @param {string} id - Message object unique id
   * @return {Boolean} is removed
   */
  removeMessage(id) {
    const { chatApi } = this;

    chatApi.apiRemoveMessage(id)
      .then((response) => {
        const { status, error } = response;
        if (error) {
          if (status === 401) {
            this.runSignIn();
          } else {
            this.runError(status, error);
          }
          return;
        }
        this.showMessages();
      });
  }

  /** Display messages from Message model */
  showMessages() {
    const { chatApi, state, user } = this;
    const { skip, top, filter } = state;
    const { chat } = this.views;

    chatApi.apiGetMessages(skip, top, filter)
      .then((response) => {
        const { status, error } = response;
        if (error) {
          if (status === 401) {
            this.runSignIn();
          } else {
            this.runError(status, error);
          }
          return;
        }
        const msgs = response;
        chat.display(user, msgs.reverse(), false, true);
      });
  }

  /** Display active (online) users from User model. */
  showActiveUsers() {
    const { activeUsers } = this.views;
    const { chatApi } = this;

    chatApi.apiGetUsers()
      .then((response) => {
        const { error, status } = response;
        if (error) {
          if (status === 401) {
            this.runSignIn();
          } else {
            this.runError(status, error);
          }
          return;
        }
        const users = [];
        if (response.forEach) {
          response.forEach(item => {
            if (item.isActive) {
              users.push(item.name);
            }
          })
        }
        activeUsers.display(users);
      });
  }

  /** Display selected users from User model. */
  showPersonalUsers() {
    const { personalUsers: users } = this.state;
    const { personalUsers } = this.views;

    personalUsers.display(users);
  }
}

const chatCtrl = new ChatController();
chatCtrl.runChat();
