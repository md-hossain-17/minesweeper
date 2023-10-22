import Minesweeper from './minesweeper.js';

const boardElement = document.querySelector('.board');

const MINE_COUNT_COLOR = {
    1: '#006699',
    2: '#008000',
    3: 'crimson',
    4: 'purple',
    5: 'brown',
    6: 'teal',
    7: '#333',
    8: 'grey',
};

const NUM_ROWS = 8;
const NUM_COLS = 10;
const NUM_MINES = 10;
const minesweeper = new Minesweeper(NUM_ROWS, NUM_COLS, NUM_MINES);

const createBoard = () => {
    for (let i = 0; i < NUM_ROWS; i++) {
        const rowElement = document.createElement('div');
        for (let j = 0; j < NUM_COLS; j++) {
            const tileElement = document.createElement('div');
            tileElement.dataset.row = i;
            tileElement.dataset.col = j;
            tileElement.dataset.state = 'hidden';
            tileElement.classList.add('tile');
            tileElement.addEventListener('click', init);
            rowElement.append(tileElement);
        }
        rowElement.classList.add('row');
        boardElement.append(rowElement);
    }
};

const init = (e) => {
    const [row, col] = getEventCoord(e);
    minesweeper.init(row, col);
    document.querySelectorAll('.tile').forEach((e) => {
        e.removeEventListener('click', init);
        e.addEventListener('click', revealTile);
        e.addEventListener('contextmenu', flagTile);
    });
    e.target.click();
};

const getEventCoord = (e) => [
    Number(e.target.dataset.row),
    Number(e.target.dataset.col),
];

const getTileElement = (tile) =>
    document.querySelector(`[data-row='${tile.row}'][data-col='${tile.col}']`);

const revealTile = (e) => {
    const [row, col] = getEventCoord(e);
    minesweeper.revealTile(row, col);
    minesweeper.board
        .flat()
        .filter((t) => t.isRevealed)
        .forEach((t) => {
            const element = getTileElement(t);
            if (t.hasMine) {
                element.dataset.state = 'revealed-mine';
            } else if (t.numAdjMines > 0) {
                element.textContent = t.numAdjMines;
                element.dataset.state = 'revealed-count';
                element.style.color = MINE_COUNT_COLOR[t.numAdjMines];
            } else {
                element.dataset.state = 'revealed-safe';
            }
            element.removeEventListener('contextmenu', flagTile);
        });
};

const flagTile = (e) => {
    e.preventDefault();
    const [row, col] = getEventCoord(e);
    minesweeper.flagTile(row, col);
    const tile = minesweeper.board[row][col];
    const element = getTileElement(tile);
    element.dataset.state = tile.isFlagged ? 'flagged' : 'hidden';
};

createBoard();

document.addEventListener('contextmenu', (e) => e.preventDefault());
