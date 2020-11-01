import chatContent from './chatContent.js';
import test from './test.js'

(function (content) {
  const { messages } = content;

  const DMChat = {
    getMessages: getMessages,
    getMessage: getMessage,
    validateMessage: validateMessage,
    addMessage: addMessage,
    editMessage: editMessage,
    removeMessage: removeMessage,
  }

  function getMessages(skip = 0, top = 10, filterConfig) {
    const { author, dateFrom, dateTo, text } = filterConfig ? filterConfig : {};

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
    return messages[id];
  }

  function validateMessage(msg) {
    if (!msg) return false
    const { id, text, createdAt, author } = msg;
    const validTypes = typeof id === 'string' && typeof text === 'string' && typeof createdAt === 'object' && typeof author === 'string';
    const validValue = id && text && createdAt && author;
    return validValue && validTypes ? true : false;
  }

  function addMessage(msg) {
    if (!validateMessage(msg)) return false;
    messages.push(msg);
    return true;
  }

  function editMessage(msgId, msg) {
    if (!messages[msgId]) return false;
    const { id, author, createdAt } = messages[msgId]
    const newMessage = {
      ...messages[msgId], 
      ...msg, 
      id: id, 
      author: author, 
      createdAt: createdAt
    };
    if (!validateMessage(newMessage)) return false;
    messages[msgId] = newMessage;
    return true;
  }

  function removeMessage(id) {
    const delMsg = messages.splice(id, 1);
    return delMsg.length > 0 ? true : false;
  }

  window.DMChat = { ...DMChat, runTest: () => test(DMChat) }
}(chatContent))