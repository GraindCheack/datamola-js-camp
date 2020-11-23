'use strict';

import {
  MessageModel,
  UserModel
} from './Model/index.js';

import {
  ActiveUsersView,
  FilterView,
  HeaderView,
  MessagesView,
  PersonalUsersView
} from './View/index.js';

const messagesModel = new MessageModel();
const usersModel = new UserModel();
const headerView = new HeaderView('header');
const chatView = new MessagesView('chat__content');
const activeUsersView = new ActiveUsersView('active-user__list');
const personalUsersView = new PersonalUsersView('personal-user__list');
const filterView = new FilterView('filter-select-list');

/**
 * Set new current user
 * 
 * @param {string} user - new user name
 */
function setCurrentUser(user) {
  const lastUserId = usersModel.activeUsers.findIndex(item => item === messagesModel.user);
  usersModel.activeUsers.splice(lastUserId, 1);
  messagesModel.user = user;
  if (user && !(user in usersModel.activeUsers)) {
    usersModel.activeUsers.push(user);
  }
  usersModel.personalUsers = [];
  headerView.display(user);
  chatView.display(user);
  activeUsersView.display(usersModel.users);
  personalUsersView.display(user);
}

/**
 * Add Message
 *
 * @param {object} msg - message object
 * @return {Boolean} is added
 */
function addMessage(msg) {
  if (messagesModel.add(msg)) {
    const newMsg = messagesModel.msgs.slice(-1)[0];
    chatView.addMessage(newMsg, messagesModel.user);
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
function editMessage(id, msg) {
  if (messagesModel.edit(id, msg)) {
    const editedMsg = messagesModel.msgs.find(item => item.id === id);
    chatView.editMessage(id, editedMsg, messagesModel.user);
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
function removeMessage(id) {
  if (messagesModel.remove(id)) {
    chatView.removeMessage(id, messagesModel.user);
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
function showMessages(skip, top, filterConfig) {
  const msgs = messagesModel.getPage(skip, top, filterConfig);
  chatView.display(messagesModel.user, msgs, false, true);
}

/** Display active (online) users from User model. */
function showActiveUsers() {
  const { activeUsers } = usersModel;
  activeUsersView.display(activeUsers);
}

/** Display selected users from User model. */
function showPersonalUsers() {
  personalUsersView.display(messagesModel.user, usersModel.personalUsers);
}

window.setCurrentUser = setCurrentUser;
window.addMessage = addMessage;
window.editMessage = editMessage;
window.removeMessage = removeMessage;
window.showMessages = showMessages;
window.showActiveUsers = showActiveUsers;
window.showPersonalUsers = showPersonalUsers;

setCurrentUser('GraindCheack');
addMessage({ text: "!!!Привет" });
addMessage({ text: "1" });
addMessage({ id: '2', text: "2" });
addMessage({ text: "3" });
addMessage({ text: "Просто текст" })
addMessage({ text: "Привет, Ivaasko", to: 'Ivaasko' });

editMessage('2', { text: "Привет!!!" });
removeMessage('2');
showActiveUsers();

usersModel.personalUsers = ['Ivaasko', 'Bondar'];
showPersonalUsers();

const filterConfig = {
  dateFrom: new Date(2020, 10, 23, 18, 0),
}

filterView.display(filterConfig)
showMessages(1, 5, filterConfig);
