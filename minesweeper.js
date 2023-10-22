class Minesweeper {
    constructor() {
        this.status = '';
        this.numRows = 0;
        this.numCols = 0;
        this.numMines = 0;
        this.board = [];
    }

    setUp(numRows, numCols, numMines) {
        this.status = 'NOT_STARTED';
        this.numRows = numRows;
        this.numCols = numCols;
        this.numMines = numMines;
        this.board = this.createBoard();
    }

    createBoard() {
        const board = [];
        for (let i = 0; i < this.numRows; i++) {
            const row = [];
            for (let j = 0; j < this.numCols; j++) {
                row.push({
                    row: i,
                    col: j,
                    hasMine: false,
                    isRevealed: false,
                    numAdjMines: 0,
                    isFlagged: false,
                });
            }
            board.push(row);
        }
        return board;
    }

    init(row, col) {
        this.status = 'IN_PROGRESS';
        const tile = this.board[row][col];
        const adjTiles = this.getAdjTiles(tile);
        let numMinesGenerated = 0;
        while (numMinesGenerated < this.numMines) {
            const randomRow = Math.floor(Math.random() * this.numRows);
            const randomCol = Math.floor(Math.random() * this.numCols);
            const randomTile = this.board[randomRow][randomCol];
            if (
                randomTile !== tile &&
                !randomTile.hasMine &&
                !adjTiles.includes(randomTile)
            ) {
                randomTile.hasMine = true;
                numMinesGenerated++;
            }
        }

        this.board.flat().forEach((tile) => {
            const adjMines = this.getAdjTiles(tile).filter((t) => t.hasMine);
            tile.numAdjMines = adjMines.length;
        });
    }

    getAdjTiles(tile) {
        const { row, col } = tile;
        const coords = [
            [row - 1, col - 1],
            [row - 1, col],
            [row - 1, col + 1],
            [row, col - 1],
            [row, col + 1],
            [row + 1, col - 1],
            [row + 1, col],
            [row + 1, col + 1],
        ];
        return coords
            .filter(
                (c) =>
                    c[0] >= 0 &&
                    c[0] < this.numRows &&
                    c[1] >= 0 &&
                    c[1] < this.numCols
            )
            .map((c) => this.board[c[0]][c[1]]);
    }

    revealTile(row, col) {
        const tile = this.board[row][col];
        if (tile.isFlagged) return;
        if (tile.isRevealed) {
            const adjTiles = this.getAdjTiles(tile);
            const numAdjFlags = adjTiles.filter((t) => t.isFlagged).length;
            if (numAdjFlags === tile.numAdjMines) {
                adjTiles
                    .filter((t) => !t.isRevealed && !(t.hasMine && t.isFlagged))
                    .forEach((t) => this.revealTile_helper(t));
            }
        } else {
            this.revealTile_helper(tile);
        }
    }

    revealTile_helper(tile) {
        if (['GAME_WIN', 'GAME_LOSE'].includes(this.status)) return;
        tile.isRevealed = true;
        if (tile.hasMine) {
            this.status = 'GAME_LOSE';
            return;
        }

        if (tile.numAdjMines === 0) {
            this.getAdjTiles(tile)
                .filter((t) => !t.isRevealed && !t.hasMine && !t.isFlagged)
                .forEach((t) => this.revealTile_helper(t));
        }

        const numRevealedTiles = this.board
            .flat()
            .filter((t) => t.isRevealed && !t.hasMine).length;
        const target = this.numRows * this.numCols - this.numMines;
        if (numRevealedTiles === target) this.status = 'GAME_WIN';
    }

    flagTile(row, col) {
        const tile = this.board[row][col];
        tile.isFlagged = !tile.isFlagged;
    }
}

export default Minesweeper;
