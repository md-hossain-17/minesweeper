import Minesweeper from './minesweeper.js';

const difficulty = document.querySelector('#difficulty');
const statusIcon = document.querySelector('.status-icon');
const mineCounter = document.querySelector('.mine-counter');
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

const STATUS_EMOJI = {
    NOT_STARTED: 'sentiment_neutral',
    IN_PROGRESS: 'sentiment_satisfied',
    GAME_WIN: 'sentiment_very_satisfied',
    GAME_LOSE: 'sentiment_very_dissatisfied',
};

const BOARD_CONFIG = {
    easy: { numRows: 8, numCols: 10, numMines: 10 },
    medium: { numRows: 14, numCols: 18, numMines: 40 },
    hard: { numRows: 20, numCols: 24, numMines: 99 },
};
const minesweeper = new Minesweeper();

const CONFETTI_SETTINGS = { target: 'confetti-canvas', rotate: true };
let confetti;

const setUp = () => {
    minesweeper.setUp(
        BOARD_CONFIG[difficulty.value].numRows,
        BOARD_CONFIG[difficulty.value].numCols,
        BOARD_CONFIG[difficulty.value].numMines
    );
    confetti?.clear();
    statusIcon.textContent = STATUS_EMOJI[minesweeper.status];
    mineCounter.textContent = BOARD_CONFIG[difficulty.value].numMines;
    createBoard();
};

const createBoard = () => {
    boardElement.textContent = '';
    for (let i = 0; i < BOARD_CONFIG[difficulty.value].numRows; i++) {
        const rowElement = document.createElement('div');
        for (let j = 0; j < BOARD_CONFIG[difficulty.value].numCols; j++) {
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
    statusIcon.textContent = STATUS_EMOJI[minesweeper.status];
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
    statusIcon.textContent = STATUS_EMOJI[minesweeper.status];
    minesweeper.board
        .flat()
        .filter((t) => t.isRevealed && !t.hasMine && !t.isFlagged)
        .forEach((t) => {
            const element = getTileElement(t);
            if (t.numAdjMines > 0) {
                element.textContent = t.numAdjMines;
                element.dataset.state = 'revealed-count';
                element.style.color = MINE_COUNT_COLOR[t.numAdjMines];
            } else {
                element.dataset.state = 'revealed-safe';
            }
            element.removeEventListener('contextmenu', flagTile);
        });

    handleGameover();
};

const flagTile = (e) => {
    e.preventDefault();
    const [row, col] = getEventCoord(e);
    minesweeper.flagTile(row, col);
    const tile = minesweeper.board[row][col];
    const element = getTileElement(tile);
    element.dataset.state = tile.isFlagged ? 'flagged' : 'hidden';

    const numFlags = minesweeper.board.flat().filter((t) => t.isFlagged).length;
    mineCounter.textContent =
        BOARD_CONFIG[difficulty.value].numMines - numFlags;
};

const handleGameover = () => {
    if (!['GAME_WIN', 'GAME_LOSE'].includes(minesweeper.status)) return;
    document.querySelectorAll('.tile').forEach((e) => {
        e.removeEventListener('click', revealTile);
        e.removeEventListener('contextmenu', flagTile);
    });
    if (minesweeper.status === 'GAME_WIN') {
        confetti = new ConfettiGenerator(CONFETTI_SETTINGS);
        confetti.render();
    } else {
        minesweeper.board
            .flat()
            .filter((t) => t.hasMine || t.isFlagged)
            .forEach((t) => {
                const element = getTileElement(t);
                if (t.hasMine && t.isFlagged) {
                    element.textContent = 'check';
                    element.style.color = '#006600';
                } else if (!t.hasMine && t.isFlagged) {
                    element.textContent = 'close';
                    element.style.color = '#b30000';
                } else if (t.hasMine) {
                    element.textContent = 'explosion';
                    element.style.color = '#b30000';
                }
                element.classList.add('material-symbols-outlined');
            });
    }
};

setUp();

document.addEventListener('contextmenu', (e) => e.preventDefault());
difficulty.addEventListener('change', setUp);
statusIcon.addEventListener('click', setUp);
