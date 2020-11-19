/**
 * Get new document element
 *
 * @param {string} [tag = 'div'] - name of tag
 * @param {string} [classes = ''] - class list
 * @param {string} [inner = ''] - content in the new element
 * @return {Node} new document element
 */
function createElement(tag = 'div', classes = '', inner = '') {
  const newElem = document.createElement(tag);
  if (classes) newElem.classList.add(...classes.split(' '));
  newElem.innerHTML = inner;
  return newElem;
}

const data = [
  {
    value: 'Пункт 1.',
    children: null,
  },
  {
    value: 'Пункт 2.',
    children: [
      {
        value: 'Подпункт 2.1.',
        children: null,
      },
      {
        value: 'Подпункт 2.2.',
        children: [
          {
            value: 'Подпункт 2.2.1.',
            children: null,
          },
          {
            value: 'Подпункт 2.2.2.',
            children: null,
          }
        ],
      },
      {
        value: 'Подпункт 2.3.',
        children: null,
      }
    ]
  },
  {
    value: 'Пункт 3.',
    children: null,
  }
];

function createListElem(elem, node, level = 0) {
  const { children, value } = node;
  const listItemElem = createElement('li', 'list__item', value);
  if (children) {
    const newListElem = createElement('ul', 'list');

    children.forEach(item => {
      createListElem(newListElem, item, level + 1);
    });

    listItemElem.appendChild(newListElem);
  }
  elem.appendChild(listItemElem);
}

function createList(title, list) {
  const body = document.querySelector('body');
  const listBlockElem = createElement('div', 'list-cont');
  const titleElem = createElement('h2', 'list__title');
  const listElem = createElement('ul', 'list');

  list.forEach(item => {
    createListElem(listElem, item, 0)
  })

  listBlockElem.appendChild(titleElem);
  listBlockElem.appendChild(listElem);
  body.appendChild(listBlockElem);
}

createList('Первый лист', data);


