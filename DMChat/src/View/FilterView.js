'use strict';

/** Class representing filter view */
class FilterView {
  /**
   * Create a view.
   * @param {string} containerId - index.html element id
   */
  constructor(containerId) {
    this.elem = document.getElementById(containerId);

    this.temp = `
      <div class="filter-selected-item">
        <img src="./images/close.svg" alt="del" class="filter-selected-item__img">
        <span class="filter-selected-item__text">{Data}</span>
      </div>
    `
  }

  /**
   * Display filter configs in index.html
   * 
   * @param {object} filterConfig - filter config object, supports:
   *    {Date} dateFrom - minimal message date
   *    {Date} dateTo - maximal message date
   *    {string} author - message author name
   *    {string} text - message text
   */
  display(filterConfig) {
    const { temp } = this;
    const { username, dateFrom, dateTo, text } = filterConfig;
    let HTMLContent = '<div class="filter-selected" id="filter-select">';
    if (username) {
      HTMLContent += temp.replace('{Data}', username);
    }
    if (dateFrom || dateTo) {
      const dateOption = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
      const formatDateFrom = dateFrom ? dateFrom.toLocaleDateString('ru', dateOption) : '';
      const formatDateTo = dateTo ? dateFrom.toLocaleDateString('ru', dateOption) : '';
      HTMLContent += temp.replace('{Data}', `${dateFrom ? formatDateFrom : '...'} - ${dateTo ? formatDateTo : '...'}`);
    }
    if (text) {
      HTMLContent += temp.replace('{Data}', text);
    }
    HTMLContent += '</div>'
    this.elem.innerHTML = '';
    this.elem.insertAdjacentHTML('beforeend', HTMLContent);
  }
}

export default FilterView;