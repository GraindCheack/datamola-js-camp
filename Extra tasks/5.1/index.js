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
 * Create new row element with day elements
 *
 * @param {number} [from = 0] - number of start day in week
 * @param {number} [to = 6] - number of end day in week
 * @param {number} [innerFrom = 1] - start number of not empty day in week
 * @return {Node} of week row with days element
 */
function createRowElem(from = 0, to = 6, innerFrom = 1) {
  const newWeekElem = createElement('tr', 'table__row');
  const fragment = new DocumentFragment();
  for (let i = 0; i < 7; i++) {
    const newDayElem = createElement('td', 'table-column', (i >= from) && (i <= to) ? `${innerFrom++}` : '');
    fragment.appendChild(newDayElem);
  }
  newWeekElem.appendChild(fragment);
  return newWeekElem;
}

/**
 * Create new calindar and insert into element
 *
 * @param {Node} elem - calendar parent element
 * @param {number} year - number of year 
 * @param {number} month - number of month
 */
function createCalendar(elem, year, month) {
  const headTitle = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const tableElem = createElement('table', 'table table__theme_dark');
  const theadElem = createElement('thead');
  const tbodyElem = createElement('tbody');
  const headRowElem = createElement('tr', 'head__row');

  headTitle.forEach(item => {
    const newTitleCell = createElement('th', 'table-column', item)
    headRowElem.appendChild(newTitleCell);
  })

  theadElem.appendChild(headRowElem);
  tableElem.appendChild(theadElem);
  tableElem.appendChild(tbodyElem);

  const date = new Date(year, month, 0);
  const amountDays = date.getDate();
  const lastWeekDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  date.setFullYear(year, month - 1)
  date.setDate(1);
  const firstWeekDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const amountMiddleDays = amountDays - (7 - firstWeekDay) - lastWeekDay;

  const firstRowElem = createRowElem(firstWeekDay, 6, 1);
  tbodyElem.appendChild(firstRowElem);

  for (let i = 0; i < (amountMiddleDays / 7).toFixed(); i++) {
    const middleRowElem = createRowElem(0, 6, ((7 - firstWeekDay + 1) + 7 * i));
    tbodyElem.appendChild(middleRowElem);
  }

  const middleRowElem = createRowElem(0, lastWeekDay, amountDays - lastWeekDay);
  tbodyElem.appendChild(middleRowElem);

  elem.appendChild(tableElem);
}


const content = document.getElementById('content');


createCalendar(content, 2020, 25);

