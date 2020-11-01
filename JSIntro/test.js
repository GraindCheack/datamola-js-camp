export default function (DMChat) {
  console.log('getMessages');
  console.log('\n', DMChat.getMessages());
  console.log('0, 10\n', DMChat.getMessages(0, 10));
  console.log('0, 30\n', DMChat.getMessages(0, 30));
  console.log('10, 10\n', DMChat.getMessages(10, 10));
  console.log('0, 20, {author: "GraindCheack"}\n', DMChat.getMessages(0, 20, { author: 'GraindCheack' }));
  console.log('0, 20, {author: "GraindCheack", dateFrom: "2020-10-12T23:00:35", dateTo: "2020-10-12T23:01:30", text: ","}\n', DMChat.getMessages(0, 20, { author: 'GraindCheack', dateFrom: '2020-10-12T23:00:35', dateTo: '2020-10-12T23:01:30', text: ',' }));
  console.log('----------');

  console.log('getMessage');
  console.log('1\n', DMChat.getMessage(1));
  console.log('46\n', DMChat.getMessage(46));
  console.log('----------');

  console.log('validateMessage');
  console.log('\n', DMChat.validateMessage());
  console.log('{id: "1"}\n', DMChat.validateMessage({ id: '1' }));
  console.log('{id: "1", author: "GraindCheack", createdAt: new Date(), text: "Hello world!"}\n', DMChat.validateMessage({ id: '1', author: 'GraindCheack', createdAt: new Date(), text: 'Hello world!' }));
  console.log('{id: "", author: "GraindCheack", createdAt: new Date(), text: "Hello world!"}\n', DMChat.validateMessage({ id: '', author: 'GraindCheack', createdAt: new Date(), text: 'Hello world!' }));
  console.log('----------');

  console.log('addMessage');
  console.log('{id: "1", author: "GraindCheack", createdAt: new Date(), text: "Hello"}\n', DMChat.addMessage({ id: '1', author: 'GraindCheack', createdAt: new Date(), text: 'Hello' }));
  console.log('{id: "1", author: "GraindCheack", createdAt: new Date()}\n', DMChat.addMessage({ id: '1', author: 'GraindCheack', createdAt: new Date() }));
  console.log('----------');

  console.log('editMessage');
  console.log('"0", { text: "hi" }\n', DMChat.editMessage('0', { text: 'hi' }));
  console.log('"30", { text: "hi" }\n', DMChat.editMessage('30', { text: 'hi' }));
  console.log('"0", { text: "hi", gh: "sf" }\n', DMChat.editMessage('0', { text: 'hi', gh: 'sf' }));
  console.log('"0", { text: "hi", author: "Ivaaasko" }\n', DMChat.editMessage('0', { text: 'hi', author: 'Ivaaasko' }));
  console.log('----------');

  console.log('removeMessage');
  console.log('19\n', DMChat.removeMessage(20));
  console.log('19\n', DMChat.removeMessage(20));
  console.log('----------');
}
