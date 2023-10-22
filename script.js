import Minesweeper from './minesweeper.js';

const boardElement = document.querySelector('.board');

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
    minesweeper.board
        .flat()
        .filter((t) => t.hasMine)
        .map((t) => getTileElement(t))
        .forEach((e) => (e.style.backgroundColor = 'crimson'));
    document
        .querySelectorAll('.tile')
        .forEach((e) => e.removeEventListener('click', init));
};

const getEventCoord = (e) => [
    Number(e.target.dataset.row),
    Number(e.target.dataset.col),
];

const getTileElement = (tile) =>
    document.querySelector(`[data-row='${tile.row}'][data-col='${tile.col}']`);

createBoard();
