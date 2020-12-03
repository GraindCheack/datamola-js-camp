'use strict';

import {
  MessageModel,
  UserModel
} from './Model/index.js';

import {
  MainView,
  ActiveUsersView,
  FilterView,
  HeaderView,
  MessagesView,
  PersonalUsersView
} from './View/index.js';

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

    this.models = {
      users: new UserModel(),
      messages: new MessageModel(),
    };

    this.state = {
      paginate: 10,
      skip: 0,
      top: 10,
      filter: {},
    }
  }

  get user() {
    return this._user;
  }

  set user(value) {
    if (typeof value === 'string' && value) {
      this._user = value;
    }
  }

  /** Redirect to chat page */
  runChat() {
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

    header.display(this.user, 'chat');
    this.showMessages();
    this.showActiveUsers();
    this.showPersonalUsers();
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
    this._user = undefined;
    this.setCurrentUser();
    this.runChat();
  }

  /** Sign up on submit */
  handleSignInSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const username = form?.username.value;

    this.setCurrentUser(username);
    this.runChat();
  }

  /** Sign up on submit */
  handleSignUpSubmit(event) {
    event.preventDefault();

    const { users } = this.models;
    const form = event.target;
    const username = form?.username.value;

    users.addNewUser(username);
    this.runSignIn();
  }

  /** Add message on submit */
  handleSendMsgSubmit(event) {
    event.preventDefault();
    const { users } = this.models;
    const form = event.target;
    const msg = {
      text: form['message__text'].value,
      author: this.user,
    };
    if (users.personalUsers.length > 0) {
      users.personalUsers.forEach(item => {
        const tempMsg = { ...msg, to: item };
        this.addMessage(tempMsg);
      })
    } else {
      this.addMessage(msg);
    }
    form.reset();
  }

  /** Edit message on submit */
  handleEditMsgSubmit(id, event) {
    event.preventDefault();
    const { chat } = this.views;
    const form = event.target;
    const msg = {
      text: form['message__text'].value,
    };
    this.editMessage(id, msg);
    chat.setFormElem((event) => this.handleSendMsgSubmit(event));
  }

  /** Add filters on submit */
  handleFilterSubmit(event) {
    event.preventDefault();
    const { filter, skip, top } = this.state;
    const elem = event.target;
    const { text, author, dateFrom, timeFrom, dateTo, timeTo } = elem;

    const dateFromFullText = dateFrom.value ?
      `${dateFrom.value || ''} ${timeFrom.value || ''}` : timeFrom.value ?
        `${new Date().toLocaleDateString('en').split(',')[0]} ${timeFrom.value || ''}` : null;
    const dateToFullText = dateTo.value ?
      `${dateTo.value || ''} ${timeTo.value || ''}` : timeTo.value ?
        `${new Date().toLocaleDateString('en').split(',')[0]} ${timeTo.value || ''}` : null;
    filter.text = text.value || null;
    filter.author = author.value || null;
    filter.dateFrom = dateFromFullText ? new Date(dateFromFullText) : null;
    filter.dateTo = dateToFullText ? new Date(dateToFullText) : null;
    this.views.filter.display(filter);
    this.showMessages(skip, top, filter);
  }

  /** Redirect to selected page on click */
  handleNavClick(event) {
    event.preventDefault();
    const action = event.target.dataset['action'];
    this[action]();
  }

  /** Do action (remove/edit/show more messages) on click */
  handleMsgControlClick(event) {
    event.preventDefault();
    const { state } = this;
    const { chat } = this.views;
    const action = event.target.dataset['action'];
    const messageElem = event.target.closest('article');
    const text = messageElem ? messageElem.querySelector('.message__text').innerHTML : '';
    const { id } = messageElem || {};

    switch (action) {
      case 'remove':
        this.removeMessage(id);
        break;
      case 'edit':
        chat.setFormElem(this.handleEditMsgSubmit.bind(this, id), 'editMsg', text);
        break;
      case 'showMore':
        state.top += state.paginate;
        this.showMessages(state.skip, state.top, state.filter);
        break;
    }
  }

  /** Add selected active user to personal list on click */
  handleActiveUserClick(event) {
    event.preventDefault();
    const { chat } = this.views;
    const elem = event.target;
    if (elem.tagName === 'LI') {
      const username = elem.innerHTML;
      this.addPersonalUser(username);
      chat.setFormElem((event) => this.handleSendMsgSubmit(event), 'addPersonalMsg');
    }
  }

  /** Delete selected active user from personal list on click */
  handlePersonalUserClick(event) {
    event.preventDefault();
    const { users } = this.models;
    const { chat } = this.views;
    const elem = event.target;
    if (elem.tagName === 'LI') {
      const username = elem.innerHTML;
      this.removePersonalUser(username);
      if (users.personalUsers.length === 0) {
        chat.setFormElem((event) => this.handleSendMsgSubmit(event));
      }
    }
  }

  /** Reset message form on default state on button[type="reset"] click */
  handleResetMsgFormElemClick(event) {
    const { users } = this.models;
    const { chat } = this.views;
    if (event.target.dataset['action'] === 'close') {
      chat.setFormElem((event) => this.handleSendMsgSubmit(event));
      users.personalUsers = [];
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
  setCurrentUser(user) {
    const { users } = this.models;

    const lastUserId = users.activeUsers.findIndex(item => item === this.user);
    users.activeUsers.splice(lastUserId, 1);
    this.user = user;
    if (user && !(user in users.activeUsers)) {
      users.activeUsers.push(user);
    }
    users.personalUsers = [];
  }

  /**
   * Add selected user and show new personal list
   *
   * @param {string} newUser - message object
   */
  addPersonalUser(newUser) {
    const { users } = this.models;

    if (users.addPersonalUser(newUser)) {
      this.showPersonalUsers();
    }
  }

  /**
   * Remove selected user and show new personal list
   *
   * @param {string} newUser - message object
   */
  removePersonalUser(newUser) {
    const { users } = this.models;

    if (users.removePersonalUser(newUser)) {
      this.showPersonalUsers();
    }
  }

  /**
   * Add Message
   *
   * @param {object} msg - message object
   * @return {Boolean} is added
   */
  addMessage(msg) {
    const { messages } = this.models;
    const { chat } = this.views;

    if (messages.add(msg)) {
      const newMsg = messages.msgs.slice(-1)[0];
      chat.addMessage(newMsg, this.user);
      return true;
    }
    return false;
  }

  /**
   * Edit Message object by id 
   * @param {string} inputId - Message object unique id
   * @param {object} msg - object with required field to edit Message
   * @return {Boolean} is edited
   */
  editMessage(id, msg) {
    const { messages } = this.models;
    const { chat } = this.views;

    if (messages.edit(id, msg, this.user)) {
      const editedMsg = messages.msgs.find(item => item.id === id);
      chat.editMessage(id, editedMsg, this.user);
      return true;
    }
    return false;
  }

  /**
   * Remove Message object by id 
   *
   * @param {string} id - Message object unique id
   * @return {Boolean} is removed
   */
  removeMessage(id) {
    const { messages } = this.models;
    const { chat } = this.views;

    if (messages.remove(id, this.user)) {
      chat.removeMessage(id);
      return true;
    }
    return false;
  }

  /**
   * Display messages from Message model
   *
   * @param {number} [skip = 0] - number of skiped messages
   * @param {number} [top = 10] - number of paginated messages 
   * @param {object} filterConfig - filter config object
   */
  showMessages(skip, top, filterConfig) {
    const { user } = this;
    const { messages } = this.models;
    const { chat } = this.views;

    const msgs = messages.getPage(skip, top, filterConfig, user);
    chat.display(this.user, msgs, false, true);
  }

  /** Display active (online) users from User model. */
  showActiveUsers() {
    const { users } = this.models;
    const { activeUsers } = this.views;

    activeUsers.display(users.activeUsers);
  }

  /** Display selected users from User model. */
  showPersonalUsers() {
    const { users } = this.models
    const { personalUsers } = this.views;

    personalUsers.display(users.personalUsers);
  }
}

/** Set default message and user value in local storage */
function setChatStorage() {
  if (!localStorage.getItem('msgs') || !localStorage.getItem('users')) {
    localStorage.setItem('msgs', '[]')
    localStorage.setItem('users', '[]')
  }
}

setChatStorage();

const chatCtrl = new ChatController();
chatCtrl.runChat();
