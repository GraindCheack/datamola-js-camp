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

/**
 * Recursive function. Add new elements to parent element
 *
 * @param {Node} elem - parent element
 * @param {object} node - node object, supports:
 *    {string} value - text content
 *    {Array.<object>} children - nodes array
 */
function createListElem(elem, node) {
  const { children, value } = node;
  const listItemElem = createElement('li', 'list__item');
  const listItemHeadElem = createElement('span', 'list__text', value);
  listItemElem.appendChild(listItemHeadElem);
  if (children) {
    const newListElem = createElement('ul', 'list');

    children.forEach(item => {
      createListElem(newListElem, item);
    });

    listItemElem.appendChild(newListElem);
  }
  elem.appendChild(listItemElem);
}

/**
 * Create list in body
 *
 * @param {string} title - parent element
 * @param {Array.<object>} node - node object, object supports:
 *    {string} value - text content
 *    {Array.<object>} children - nodes array
 */
function createList(title, list) {
  const body = document.body;
  const listBlockElem = createElement('div', 'list-cont');
  listBlockElem.addEventListener('click', (event) => {
    const { target, path } = event;
    if (target && target.tagName === 'SPAN') {
      const parentElem = path.find(item => item.classList.contains('list__item'));
      const childList = [...parentElem.children].find(item => item.tagName === 'UL');
      if (childList) {
        childList.classList.toggle('list_hidden');
      }
    }
  })
  const titleElem = createElement('h2', 'list__title', title);
  const listElem = createElement('ul', 'list');

  list.forEach(item => {
    createListElem(listElem, item);
  })

  listBlockElem.appendChild(titleElem);
  listBlockElem.appendChild(listElem);
  body.appendChild(listBlockElem);
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

createList('Первый лист', data);


