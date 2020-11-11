import chatContent from './chatContent.js';
import test from './test.js'

(function (content) {
  const { messages } = content;
  const currentAuthor = 'GraindCheack';

  const DMChat = {
    getMessages: getMessages,
    getMessage: getMessage,
    validateMessage: validateMessage,
    addMessage: addMessage,
    editMessage: editMessage,
    removeMessage: removeMessage,
  }

  function getMessages(skip = 0, top = 10, filterConfig) {
    const { author, dateFrom, dateTo, text } = filterConfig || {};

    let newMessages = messages.slice(skip, skip + top);
    newMessages = filterConfig ? newMessages.filter(item => {
      const isAuthor = !author ? true : item.author.includes(author) ? true : false;
      const isDateFrom = !dateFrom ? true : item.createdAt >= new Date(dateFrom) ? true : false;
      const isDateTo = !dateTo ? true : item.createdAt <= new Date(dateTo) ? true : false;
      const isText = !text ? true : item.text.includes(text) ? true : false;
      return isAuthor && isDateFrom && isDateTo && isText;
    }) : newMessages;

    return newMessages.sort((a, b) => {
      return +a.createdAt - +b.createdAt;
    });
  }

  function getMessage(id) {
    return messages.find(item => item.id === `${id}`);
  }

  function validateMessage(msg) {
    if (!msg) return false;
    const { id, text, createdAt, author } = msg;
    const validTypes = typeof id === 'string' && typeof text === 'string' && typeof createdAt === 'object' && typeof author === 'string';
    const validValue = Boolean(id && text && createdAt && author);
    return validValue && validTypes && text.length <= 200;
  }

  function addMessage(msg) {
    const id = `${+Math.max(...messages.map(item => item.id)) + 1}`;
    const newMessage = {
      ...msg,
      id: id,
      author: currentAuthor,
      createdAt: new Date(),
    };
    if (!newMessage?.text || typeof newMessage.text !== 'string') return false;
    messages.push(newMessage);
    return true;
  }

  function editMessage(msgId, msg) {
    const placeId = messages.findIndex(item => item.id === `${msgId}`)
    if (placeId < 0) return false;
    const { id, author, createdAt } = messages[placeId]
    const newMessage = {
      ...messages[placeId],
      ...msg,
      id: id,
      author: author,
      createdAt: createdAt
    };
    if (!validateMessage(newMessage)) return false;
    messages[placeId] = newMessage;
    return true;
  }

  function removeMessage(id) {
    const placeId = messages.findIndex(item => item.id === `${id}`)
    if (placeId < 0) return false
    const delMsg = messages.splice(placeId, 1);
    return delMsg.length > 0;
  }

  window.DMChat = { ...DMChat, runTest: () => test(DMChat) }
}(chatContent))