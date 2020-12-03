const gameElem = document.getElementById('game');

/** Class representing game */
class Game {
  /**
   * Create a view.
   * @param {Node} game - game element
   */
  constructor(game) {
    this.gameElem = game;
    this.gameTmp = `
      <div class="game-grid" id="game-field-tmp">
        <div class="game-item" id="game-item-1"></div>
        <div class="game-item" id="game-item-2"></div>
        <div class="game-item" id="game-item-3"></div>
        <div class="game-item" id="game-item-4"></div>
        <div class="game-item" id="game-item-5"></div>
        <div class="game-item" id="game-item-6"></div>
        <div class="game-item" id="game-item-7"></div>
        <div class="game-item" id="game-item-8"></div>
        <div class="game-item" id="game-item-9"></div>
      </div>
    `;

    this.winTmp = `
      <div class="win-message__content">
        <button class="win-message__close" id="win-message__close">
          <img src="./close.svg" alt="close" class="close__img">
        </button>
        <h2 class="win-message__text">Win!</h2>
        <p id="win-message__name">{Name}</p>
      </div>
    `;

    this.formTmp = `
      <form name="game" class="game-form">
        <label for="game__input" class="game__label" id="game__time">00:00</label>
        <button type="submit" class="game__button" id="game__button">Start / Restart</button>
        <div class="game-symbol">
          <input class="game-symbol__input" type="radio" name="symbol" id="form-zero" checked disabled>
          <label for="form-zero" class="game-symbol__label"><img class="game-symbol__img" src="./zero.svg" alt="zero"></label>
          <input class="game-symbol__input" type="radio" name="symbol" id="form-cross" disabled>
          <label for="form-cross" class="game-symbol__label"><img class="game-symbol__img" src="./cross.svg" alt="cross"></label>
        </div>
      </form>
    `;
    this.figureHTML = '<img src="{Path}" alt="{Alt}" class="{ClassName}">';
    this.nowMove = 'zero';
    this.gameMap = ['', '', '', '', '', '', '', '', ''];
    this.isCompGame = false;
  }

  /**
   * Check line on winner
   * 
   * @param {number} a,
   * @param {number} b - values for equation (a*i + k) for check line
   * @return {boolean} - is winner
   */
  isWinLine(a, k) {
    const { gameMap } = this;
    if (
      (gameMap[k] === gameMap[a * 1 + k]) &&
      (gameMap[a * 1 + k] === gameMap[a * 2 + k]) &&
      (gameMap[k])
    ) {
      return true;
    }
    return false;
  }

  /**
   * Check line on possibility to win
   * 
   * @param {number} a,
   * @param {number} b - values for equation (a*i + k) for check line
   * @return {boolean} - possibility to win in this line
   */
  isMayWinLine(a, k) {
    const { gameMap, nowMove } = this;
    if (
      ((gameMap[k] || nowMove) === (gameMap[a * 1 + k] || nowMove)) &&
      ((gameMap[a * 1 + k] || nowMove) === (gameMap[a * 2 + k] || nowMove))
    ) {
      return true;
    }
    return false;
  }

  /**
   * Do move: add figure into item and check winner 
   * 
   * @return {object/null} - winner params, may contains:
   *    {string} win - winner name
   *    {number} a, {number} k - values for filling win items
   */
  getWinner() {
    const { gameMap } = this;
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
      if (this.isWinLine(1, i * 3)) {
        return { win: gameMap[i * 3], a: 1, k: i * 3 };
      }
      if (this.isMayWinLine(1, i * 3)) {
        isDraw = false;
      }
      if (this.isWinLine(3, i)) {
        return { win: gameMap[i], a: 3, k: i };
      }
      if (this.isMayWinLine(3, i)) {
        isDraw = false;
      }
    }
    if (this.isWinLine(4, 0)) {
      return { win: gameMap[0], a: 4, k: 0 };
    }
    if (this.isMayWinLine(4, 0)) {
      isDraw = false;
    }
    if (this.isWinLine(2, 2)) {
      return { win: gameMap[2], a: 2, k: 2 };
    }
    if (this.isMayWinLine(2, 2)) {
      isDraw = false;
    }
    if (isDraw) {
      return { win: 'draw' };
    } else
      return null;
  }

  /** Change current figure move */
  changeMove() {
    const zeroRElem = this.gameElem.querySelector('#form-zero');
    const crossRElem = this.gameElem.querySelector('#form-cross');
    this.nowMove = this.nowMove === 'zero' ? 'cross' : 'zero';
    if (zeroRElem.checked) {
      crossRElem.checked = true;
    } else {
      zeroRElem.checked = true;
    }
  }

  /** Selecting field item by computer */
  computerMove() {
    const { gameMap, nowMove } = this;
    const emptyPosArr = [];
    gameMap.forEach((item, index) => {
      if (!item) emptyPosArr.push(index);
    });
    const itemId = emptyPosArr[Math.floor(Math.random() * emptyPosArr.length)] + 1;
    const itemElem = this.gameElem.querySelector(`#game-item-${itemId}`);
    const pathElem = nowMove === 'zero' ? './zero.svg' : './cross.svg';
    gameMap[itemId - 1] = nowMove;
    this.doMove(itemElem, pathElem, nowMove);
  }

  /**
   * Do move: add figure into item and check winner 
   * 
   * @param {Node} elem - selected element
   * @param {string} path - path to figure image
   * @param {string} name - name figure
   */
  doMove(elem, path, name) {
    this.changeMove();
    const newHTML = this.figureHTML
      .replace('{Path}', path)
      .replace('{Alt}', name)
      .replace('{ClassName}', 'game-figure');
    elem.insertAdjacentHTML('beforeend', newHTML);
    const winProps = this.getWinner();
    if (winProps) {
      this.isCompGame = false;
      this.displayWinner(winProps);
    }
  }

  /** Update timer element on page */
  updateTimer() {
    const diff = new Date(new Date() - this.timer.start);
    const second = diff.getSeconds();
    const minute = diff.getMinutes();
    if (minute === 60) {
      alert('Are you sleeping???');
      this.startTimer();
    }
    const { elem } = this.timer;
    elem.innerHTML = `${minute / 10 < 1 ? `0${minute}` : minute}:${second / 10 < 1 ? `0${second}` : second}`;
  }

  /** Start move timer */
  startTimer() {
    const { timer } = this;
    if (timer) {
      timer.clearTimer();
      timer.elem.innerHTML = '00:00';
    }
    this.isCompGame = true;
    this.timer = {
      id: setInterval(() => { this.updateTimer() }, 1000),
      start: new Date(),
      elem: this.gameElem.querySelector('#game__time'),
      clearTimer: () => clearInterval(this.timer.id)
    }
  }

  /** Reset game field */
  reset() {
    const gameFieldElem = this.gameElem.querySelector('#game-field-tmp');
    const zeroRElem = this.gameElem.querySelector('#form-zero');
    for (const child of gameFieldElem.children) {
      child.innerHTML = '';
      child.classList.remove('game-item_win')
    }
    if (this.timer) {
      this.timer.clearTimer();
    }
    this.nowMove = 'zero';
    zeroRElem.checked = true;
    this.gameMap = ['', '', '', '', '', '', '', '', ''];
  }

  /** Select field item for move on click */
  handleGameItemClick(event) {
    const { nowMove, gameMap } = this;
    const elem = event?.target;
    const elemNumbsMatch = elem.id?.match(/\d+/);
    const elemId = elemNumbsMatch ? elemNumbsMatch[0] : 0;
    const path = nowMove === 'zero' ? './zero.svg' : './cross.svg';
    const name = nowMove;
    if (gameMap[elemId - 1] === '') {
      gameMap[elemId - 1] = name;
      this.doMove(elem, path, name);
    }
    if (this.isCompGame) {
      this.computerMove();
      this.startTimer()
    }
  }

  /** Start game with computer on submit */
  handleGameFormSubmit(event) {
    event.preventDefault();
    this.reset();
    this.startTimer();
    this.computerMove();
  }

  /**
   * Display messages in index.html
   * 
   * @param {number} a, 
   * @param {number} k - values for equation (a*i + k) for filling items
   */
  fillWinLine(a, k) {
    const items = [];
    items.push(gameElem.querySelector(`#game-item-${k + 1}`))
    items.push(gameElem.querySelector(`#game-item-${a + k + 1}`))
    items.push(gameElem.querySelector(`#game-item-${2 * a + k + 1}`))
    items.forEach(item => {
      item.classList.add('game-item_win')
    })
  }

  /**
   * Display messages in index.html
   * 
   * @param {object} - supports:
   *    {string} win - winner name
   *    {number} a, {number} k - values for filling win items
   */
  displayWinner({ win, a, k }) {
    const { winTmp } = this;
    const newWinTmp = winTmp.replace('{Name}', win);
    const winElem = document.createElement('div');
    winElem.classList.add('win-message');
    winElem.insertAdjacentHTML('beforeend', newWinTmp);

    const body = document.body;
    body.appendChild(winElem);

    const closeBtn = body.querySelector('#win-message__close');
    closeBtn.addEventListener('click', () => {
      body.removeChild(winElem);
      this.reset();
    })
    if (win !== 'draw') {
      this.fillWinLine(a, k);
    }
  }

  /** Display game interface */
  display() {
    const { gameElem, gameTmp, formTmp } = this;
    gameElem.innerHTML = '';
    gameElem.insertAdjacentHTML('beforeend', formTmp + gameTmp);
    const formElem = document.forms.game;
    const gameFieldElem = this.gameElem.querySelector('#game-field-tmp');
    formElem.addEventListener('submit', (event) => this.handleGameFormSubmit(event));
    gameFieldElem.addEventListener('click', (event) => this.handleGameItemClick(event));
  }
}

const game = new Game(gameElem);
game.display()
