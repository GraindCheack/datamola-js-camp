const messages = [
  {
    id: '1',
    text: 'Привет всем!',
    createdAt: new Date('2020-10-12T23:00:00'),
    author: 'GraindCheack',
    isPersonal: false,
  },
  {
    id: '2',
    text: 'Привет',
    createdAt: new Date('2020-10-12T23:00:30'),
    author: 'Ivaaasko',
    isPersonal: false,
  },
  {
    id: '3',
    text: 'Привет',
    createdAt: new Date('2020-10-12T23:00:35'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '4',
    text: 'Хах, в этом чате все еще кто-то есть..',
    createdAt: new Date('2020-10-12T23:01:00'),
    author: 'GraindCheack',
    isPersonal: false,
  },
  {
    id: '5',
    text: 'Я недавно прочитал интересную книгу угадайте по цитате',
    createdAt: new Date('2020-10-12T23:01:10'),
    author: 'GraindCheack',
    isPersonal: false,
  },
  {
    id: '6',
    text: 'Не требуйте гарантий. И не ждите спасения от чего-то одного – от человека, или машины, или библиотеки. ',
    createdAt: new Date('2020-10-12T23:01:30'),
    author: 'GraindCheack',
    isPersonal: false,
  },
  {
    id: '7',
    text: 'Сами создавайте то, что может спасти мир, – и если утонете по дороге, так хоть будете знать, что плыли к берегу.',
    createdAt: new Date('2020-10-12T23:01:35'),
    author: 'GraindCheack',
    isPersonal: false,
  },
  {
    id: '8',
    text: 'А что за книга?',
    createdAt: new Date('2020-10-12T23:02:00'),
    author: 'Gerasim',
    isPersonal: true,
    to: 'GraindCheack'
  },
  {
    id: '9',
    text: '451 градус по Фаренгейту',
    createdAt: new Date('2020-10-12T23:02:20'),
    author: 'GraindCheack',
    isPersonal: true,
    to: 'Gerasim'
  },
  {
    id: '10',
    text: 'Лучше купить, но сейчас кину ссылку, где можно прочитать',
    createdAt: new Date('2020-10-12T23:05:00'),
    author: 'GraindCheack',
    isPersonal: true,
    to: 'Gerasim'
  },
  {
    id: '11',
    text: 'https://azbyka.ru/fiction/451-gradus-po-farengejtu/',
    createdAt: new Date('2020-10-12T23:05:10'),
    author: 'GraindCheack',
    isPersonal: true,
    to: 'Gerasim'
  },
  {
    id: '12',
    text: 'Спасибо',
    createdAt: new Date('2020-10-12T23:06:00'),
    author: 'Gerasim',
    isPersonal: true,
    to: 'GraindCheack'
  },
  {
    id: '13',
    text: '451 градус по Фаренгейту',
    createdAt: new Date('2020-10-12T23:07:00'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '14',
    text: 'Только нашёл',
    createdAt: new Date('2020-10-12T23:07:10'),
    author: 'Ivaaasko',
    isPersonal: false,
  },
  {
    id: '15',
    text: 'https://www.litres.ru/rey-bredberi/451-gradus-po-farengeytu-39507162/?utm_source=yandex&utm_medium=cpc&utm_campaign=%2Asearch_general_ohvat%20543124948&utm_content=9787794058&utm_term=451%20градус%20по%20фаренгейту%20книгаМинск_157&_openstat=ZGlyZWN0LnlhbmRleC5ydTs0NDQwNjU4Mjs5Nzg3Nzk0MDU4O3lhbmRleC5ieTpwcmVtaXVt&yclid=6486676372392814938',
    createdAt: new Date('2020-10-12T23:07:20'),
    author: 'Ivaaasko',
    isPersonal: false,
  },
  {
    id: '16',
    text: 'Платно. Денег нет...',
    createdAt: new Date('2020-10-12T23:08:00'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '17',
    text: 'Вот бесплтано для ОЗНАКОМЛЕНИЯ))',
    createdAt: new Date('2020-10-12T23:08:20'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '18',
    text: 'https://azbyka.ru/fiction/451-gradus-po-farengejtu/',
    createdAt: new Date('2020-10-12T23:08:30'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '19',
    text: 'Ладно. Поздно уже... Всем пока',
    createdAt: new Date('2020-10-12T23:09:00'),
    author: 'Gerasim',
    isPersonal: false,
  },
  {
    id: '20',
    text: 'Давай',
    createdAt: new Date('2020-10-12T23:09:20'),
    author: 'Ivaaasko',
    isPersonal: false,
  },
]

export default {
  messages: messages,
}
