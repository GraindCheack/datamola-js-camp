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
    this._user = 'GraindCheack';
  }

  get user() {
    return this._user;
  }

  set user(value) {
    if (typeof value === String && value) {
      this._user = value;
    }
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
  getPage(skip = 0, top = 10, filterConfig) {
    const { author, dateFrom, dateTo, text } = filterConfig || {};
    const msgs = this.msgs;

    let newMsgs = filterConfig ? msgs.filter(item => {
      const isAuthor = !author ? true : item.author.includes(author) ? true : false;
      const isDateFrom = !dateFrom ? true : item.createdAt >= new Date(dateFrom) ? true : false;
      const isDateTo = !dateTo ? true : item.createdAt <= new Date(dateTo) ? true : false;
      const isText = !text ? true : item.text.includes(text) ? true : false;
      const allowPersonal = (item.isPersonal && (item.to === this.user || item.author === this.user) || !item.isPersonal)
      return isAuthor && isDateFrom && isDateTo && isText && allowPersonal;
    }) : this.msgs;
    newMsgs = newMsgs.sort((a, b) => {
      return +a.createdAt - +b.createdAt;
    });

    return newMsgs.slice(skip, skip + top);
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
   * Get Message object by id
   *
   * @param {object} msg - object with fields for Message constructor, supports:
   *    {string} text - message text
   *    {stirng} [id] - message unique id
   *    {stirng} [author] - message author name
   *    {Date} [createdAt] - message creation date
   *    {stirng} [to] - message recipient name
   * @return {Boolean} is added
   */
  add(msg) {
    const { to, text, id, createdAt, author } = msg;
    const newMsg = new Message(author || this.user, to, createdAt, text, id);
    if (MessageModel.validate(newMsg)) {
      this.msgs.push(newMsg);
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
  edit(inputId, msg) {
    const placeId = messages.findIndex(item => item.id === inputId)
    if (placeId < 0) return false;
    const listMsg = this.msgs[placeId];
    if (listMsg.author !== this.user) {
      return false;
    }
    const { id, author, createdAt, to } = listMsg;
    const { text } = msg;
    const newMsg = new Message(author, to, createdAt, text, id);
    if (MessageModel.validate(newMsg)) {
      this.msgs[placeId] = newMsg;
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
  remove(id) {
    const msgs = this.msgs;
    const placeId = msgs.findIndex(item => item.id === id);
    if (placeId < 0) return false
    const msg = msgs[placeId];
    if (msg.author === this.user) {
      const delMsg = msgs.splice(placeId, 1);
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
      } else {
        notValidMsgs.push(msg);
      }
    }
    return notValidMsgs;
  }

  /** Clear all Message objects. */
  clear() {
    this.msgs = [];
  }
}

const messages = [
  {
    id: '1',
    text: 'Привет всем!',
    createdAt: new Date('2020-10-12T23:00:00'),
  },
  {
    id: '15',
    text: 'Привет',
    createdAt: new Date('2020-10-12T23:00:30'),
    author: 'Ivaaasko',
  },
  {
    text: 'Привет',
    createdAt: new Date('2020-10-12T23:00:35'),
    author: 'Gerasim',
  },
  {
    text: 'Хах, в этом чате все еще кто-то есть..',
    createdAt: new Date('2020-10-12T23:01:00'),
  },
  {
    text: 'Я недавно прочитал интересную книгу угадайте по цитате',
    createdAt: new Date('2020-10-12T23:01:10'),
  },
  {
    text: 'Не требуйте гарантий. И не ждите спасения от чего-то одного – от человека, или машины, или библиотеки. ',
    createdAt: new Date('2020-10-12T23:01:30'),
  },
  {
    text: 'Сами создавайте то, что может спасти мир, – и если утонете по дороге, так хоть будете знать, что плыли к берегу.',
    createdAt: new Date('2020-10-12T23:01:35'),
  },
  {
    id: '2',
    text: 'А что за книга?',
    createdAt: new Date('2020-10-12T23:02:00'),
    author: 'Gerasim',
    to: 'GraindCheack'
  },
  {
    text: '451 градус по Фаренгейту',
    createdAt: new Date('2020-10-12T23:02:20'),
    to: 'Gerasim'
  },
  {
    text: 'Лучше купить, но сейчас кину ссылку, где можно прочитать',
    createdAt: new Date('2020-10-12T23:05:00'),
    to: 'Gerasim'
  },
  {
    text: 'https://azbyka.ru/fiction/451-gradus-po-farengejtu/',
    createdAt: new Date('2020-10-12T23:05:10'),
    to: 'Gerasim'
  },
  {
    text: 'Спасибо',
    createdAt: new Date('2020-10-12T23:06:00'),
    author: 'Gerasim',
    isPersonal: true,
    to: 'GraindCheack'
  },
  {
    text: '451 градус по Фаренгейту',
    createdAt: new Date('2020-10-12T23:07:00'),
    author: 'Gerasim',
  },
  {
    text: 'Только нашёл',
    createdAt: new Date('2020-10-12T23:07:10'),
    author: 'Ivaaasko',
  },
  {
    text: 'https://www.litres.ru/rey-bredberi/451-gradus-po-farengeytu-39507162/?utm_source=yandex&utm_medium=cpc&utm_campaign=%2Asearch_general_ohvat%20543124948&utm_content=9787794058&utm_term=451%20градус%20по%20фаренгейту%20книгаМинск_157&_openstat=ZGlyZWN0LnlhbmRleC5ydTs0NDQwNjU4Mjs5Nzg3Nzk0MDU4O3lhbmRleC5ieTpwcmVtaXVt&yclid=6486676372392814938',
    createdAt: new Date('2020-10-12T23:07:20'),
    author: 'Ivaaasko',
  },
  {
    text: 'Платно. Денег нет...',
    createdAt: new Date('2020-10-12T23:08:00'),
    author: 'Gerasim',
  },
  {
    text: 'Вот бесплтано для ОЗНАКОМЛЕНИЯ))',
    createdAt: new Date('2020-10-12T23:08:20'),
    author: 'Gerasim',
  },
  {
    text: 'https://azbyka.ru/fiction/451-gradus-po-farengejtu/',
    createdAt: new Date('2020-10-12T23:08:30'),
    author: 'Gerasim',
  },
  {
    text: 'Ладно. Поздно уже... Всем пока',
    createdAt: new Date('2020-10-12T23:09:00'),
    author: 'Gerasim',
  },
  {
    text: 'Давай',
    createdAt: new Date('2020-10-12T23:09:20'),
    author: 'Ivaaasko',
  },
]

const myMessagesModel = new MessageModel();
for (const msg of messages) {
  myMessagesModel.add(msg);
}

console.log('getMessages');
console.log('\n', myMessagesModel.getPage());
console.log('0, 10\n', myMessagesModel.getPage(0, 10));
console.log('0, 30\n', myMessagesModel.getPage(0, 30));
console.log('10, 10\n', myMessagesModel.getPage(10, 10));
console.log('0, 20, {author: "GraindCheack"}\n', myMessagesModel.getPage(0, 20, { author: 'GraindCheack' }));
console.log('0, 20, {dateFrom: "2020-10-12T23:00:35", dateTo: "2020-10-12T23:01:30", text: ","}\n', myMessagesModel.getPage(0, 20, { author: 'GraindCheack', dateFrom: '2020-10-12T23:00:35', dateTo: '2020-10-12T23:01:30', text: ',' }));
console.log('----------');

console.log('getMessage');
console.log('"1"\n', myMessagesModel.get('1'));
console.log('"15"\n', myMessagesModel.get('15'));
console.log('"46"\n', myMessagesModel.get('46'));
console.log('----------');

console.log('validateMessage');
console.log('"myMessagesModule.get("1")"\n', MessageModel.validate(myMessagesModel.get('1')));
console.log('"myMessagesModule.get("15")"\n', MessageModel.validate(myMessagesModel.get('15')));
console.log('"new Message("")"\n', MessageModel.validate(new Message('')));
console.log('----------');

console.log('addMessage');
console.log('{id: "1", author: "GraindCheack", createdAt: new Date(), text: "Hello"}\n', myMessagesModel.add({ id: '1', author: 'GraindCheack', createdAt: new Date(), text: 'Hello' }));
console.log('{id: "1", author: "GraindCheack", createdAt: new Date()}\n', myMessagesModel.add({ id: '1', author: 'GraindCheack', createdAt: new Date() }));
console.log('{text: "Hello!!!"}\n', myMessagesModel.add({ text: 'Hello!!!' }));
console.log('----------');

console.log('editMessage');
console.log('"1", { text: "hi" }\n', myMessagesModel.edit('1', { text: 'hi' }));
console.log('"2", { text: "hi" }\n', myMessagesModel.edit('2', { text: 'hi' }));
console.log('"0", { text: "hi" }\n', myMessagesModel.edit('0', { text: 'hi' }));
console.log('"1", { text: "hi", gh: "sf" }\n', myMessagesModel.edit('1', { text: 'hi', gh: 'sf' }));
console.log('"1", { text: "hi", author: "Ivaaasko" }\n', myMessagesModel.edit('1', { text: 'hi', author: 'Ivaaasko' }));
console.log('----------');

console.log('removeMessage');
console.log('502\n', myMessagesModel.remove('502'));
console.log('1\n', myMessagesModel.remove('1'));
console.log('----------');
