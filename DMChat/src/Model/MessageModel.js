'use strict';

function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789ABCDEF";
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[12] = "4";
  s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);

  var uuid = s.join("");
  return uuid;
}

/** Class representing a message. */
class Message {
  /**
   * Create a message.
   * @param {string} author - message author name
   * @param {string} to - message recipient name
   * @param {Date} [createdAt] - message creation date
   * @param {string} [text = ''] - message text
   * @param {string} [id = UUID] - unique id
   */
  constructor(
    author,
    to,
    createdAt,
    text = '',
    id = createUUID(),
  ) {
    this.text = text;
    this.isPersonal = Boolean(to);
    this._id = id;
    this._author = author;
    this._createdAt = createdAt || new Date();
    this.to = to || undefined;
  }

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get createdAt() {
    return this._createdAt;
  }
}

/** Class representing a message list/model. */
class MessageModel {
  /**
   * Create a model.
   * @param {Array.<Message>} [msgs = []] - Message objects array
   */
  constructor(msgs = []) {
    const newMsgs = [];
    for (const msg of msgs) {
      if (MessageModel.validate(msg)) {
        newMsgs.push(msg);
      }
    }
    this.msgs = newMsgs;
    this.restore();
  }

  /** Save message list changes in local storage */
  save() {
    const { msgs } = this;
    localStorage.setItem('msgs', JSON.stringify(msgs));
  }

  /** Restore message list from local storage */
  restore() {
    const restoreMsgs = JSON.parse(localStorage.getItem('msgs'));
    this.addAll(restoreMsgs.map(item => {
      const { _id, _author, _createdAt, text, to } = item;
      return new Message(_author, to, new Date(_createdAt), text, _id);
    }));
  }

  /**
   * Check Message object for validity
   *
   * @param {Message} msg - checked message
   * @return {boolean} is validity 
   */
  static validate(msg) {
    if (!(msg instanceof Message)) return false;
    const { id, text, createdAt, author } = msg;
    const validTypes = typeof id === 'string' && typeof text === 'string' && typeof createdAt === 'object' && typeof author === 'string';
    const validValue = Boolean(id && text && createdAt && author);
    return validValue && validTypes && text.length <= 200;
  }

  /**
   * Get filtered paginated messages page 
   *
   * @param {number} [skip = 0] - number of skiped messages
   * @param {number} [top = 10] - number of paginated messages 
   * @param {object} filterConfig - filter config object, supports:
   *    {Date} dateFrom - minimal message date
   *    {Date} dateTo - maximal message date
   *    {string} author - message author name
   *    {string} text - message text
   * @return {Array.<Message>} of Message objects
   */
  getPage(skip = 0, top = 10, filterConfig, user) {
    const { author, dateFrom, dateTo, text } = filterConfig || {};
    const msgs = this.msgs;

    let newMsgs = filterConfig ? msgs.filter(item => {
      const isAuthor = !author ? true : item.author.includes(author) ? true : false;
      const isDateFrom = !dateFrom ? true : item.createdAt >= new Date(dateFrom) ? true : false;
      const isDateTo = !dateTo ? true : item.createdAt <= new Date(dateTo) ? true : false;
      const isText = !text ? true : item.text.includes(text) ? true : false;
      const allowPersonal = (item.isPersonal && (item.to === user || item.author === user) || !item.isPersonal)
      return isAuthor && isDateFrom && isDateTo && isText && allowPersonal;
    }) : this.msgs;
    newMsgs = newMsgs.sort((a, b) => {
      return +a.createdAt - +b.createdAt;
    });

    return newMsgs.slice(-(skip + top), -skip || undefined);
  }

  /**
   * Get Message object by id
   *
   * @param {string} id - Message object unique id
   * @return {Message} of Message object
   */
  get(id) {
    return this.msgs.find(item => item.id === id);
  }

  /**
   * Add Message in a list
   *
   * @param {object} msg - object with fields for Message constructor, supports:
   *    {string} text - message text
   *    {stirng} author - message author name
   *    {stirng} [id] - message unique id
   *    {Date} [createdAt] - message creation date
   *    {stirng} [to] - message recipient name
   * @return {Boolean} is added
   */
  add(msg = {}) {
    const { to, text, id, createdAt, author } = msg;
    const newMsg = new Message(author, to, createdAt, text, id);
    if (MessageModel.validate(newMsg)) {
      this.msgs.push(newMsg);
      this.save();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Edit Message object by id
   * @param {string} inputId - Message object unique id
   * @param {object} msg - object with required field to edit Message, supports:
   *    {string} text - message text
   * @return {Boolean} is edited
   */
  edit(inputId, msg, user) {
    const placeId = this.msgs.findIndex(item => item.id === inputId)
    if (placeId < 0) return false;
    const listMsg = this.msgs[placeId];
    if (listMsg.author !== user) {
      return false;
    }
    const { id, author, createdAt, to } = listMsg;
    const { text } = msg;
    const newMsg = new Message(author, to, createdAt, text, id);
    if (MessageModel.validate(newMsg)) {
      this.msgs[placeId] = newMsg;
      this.save();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Remove Message object by id from the Message array
   *
   * @param {string} id - Message object unique id
   * @return {Boolean} is removed
   */
  remove(id, user) {
    const msgs = this.msgs;
    const placeId = msgs.findIndex(item => item.id === `${id}`);
    if (placeId < 0) return false
    const msg = msgs[placeId];
    if (msg.author === user) {
      const delMsg = msgs.splice(placeId, 1);
      this.save();
      return delMsg.length > 0;
    } else {
      return false;
    }
  }

  /**
   * Add all Message objects from array
   *
   * @param {Array.<Messages>} msgs - Message objects array
   * @return {Array.<Messages>} of not valid Message objects array
   */
  addAll(msgs) {
    const notValidMsgs = [];
    for (const msg of msgs) {
      if (MessageModel.validate(msg)) {
        this.msgs.push(msg);
        this.save();
      } else {
        notValidMsgs.push(msg);
      }
    }
    return notValidMsgs;
  }

  /** Clear all Message objects. */
  clear() {
    this.msgs = [];
    this.save();
  }
}

export default MessageModel;