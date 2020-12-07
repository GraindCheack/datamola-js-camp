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
    const { temp, elem } = this;
    const { author, dateFrom, dateTo, text } = filterConfig;
    elem.innerHTML = '';
    if (!(author || dateFrom || dateTo || text)) {
      return
    }
    let HTMLContent = '<div class="filter-selected" id="filter-select">';
    if (author) {
      HTMLContent += temp.replace('{Data}', author);
    }
    if (dateFrom || dateTo) {
      HTMLContent += temp.replace('{Data}', `${dateFrom || '...'} - ${dateTo || '...'}`);
    }
    if (text) {
      HTMLContent += temp.replace('{Data}', text);
    }
    HTMLContent += '</div>'
    elem.insertAdjacentHTML('beforeend', HTMLContent);
  }
}

export default FilterView;