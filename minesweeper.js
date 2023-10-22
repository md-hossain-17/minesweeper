class Minesweeper {
    constructor(numRows, numCols, numMines) {
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
        tile.isRevealed = true;
        if (!tile.hasMine && tile.numAdjMines === 0) {
            this.getAdjTiles(tile)
                .filter((t) => !t.isRevealed && !t.hasMine && !t.isFlagged)
                .forEach((t) => this.revealTile_helper(t));
        }
    }

    flagTile(row, col) {
        const tile = this.board[row][col];
        tile.isFlagged = !tile.isFlagged;
    }
}

export default Minesweeper;
