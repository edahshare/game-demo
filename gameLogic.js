class MinesArenaGame {
  constructor(rows = 8, cols = 8, minesCount = 10, maxRounds = 20) {
    this.rows = rows;
    this.cols = cols;
    this.minesCount = minesCount;
    this.maxRounds = maxRounds;
    this.currentRound = 0;
    this.board = this.createBoard();
    this.mines = this.placeMines();
    this.revealed = new Set();
    this.scores = new Map();
  }

  createBoard() {
    const board = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));
    return board;
  }

  placeMines() {
    const mines = new Set();
    while (mines.size < this.minesCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      mines.add(r + ',' + c);
    }
    return mines;
  }

  isMine(row, col) {
    return this.mines.has(row + ',' + col);
  }

  revealCell(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return null;
    }
    if (this.revealed.has(row + ',' + col)) {
      return null;
    }
    this.revealed.add(row + ',' + col);
    if (this.isMine(row, col)) {
      return -1; // mine
    }
    const count = this.countAdjacentMines(row, col);
    this.board[row][col] = count;
    return count;
  }

  countAdjacentMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          if (this.isMine(nr, nc)) count++;
        }
      }
    }
    return count;
  }

  addPlayer(playerId) {
    if (!this.scores.has(playerId)) {
      this.scores.set(playerId, 0);
    }
  }

  makeMove(playerId, row, col) {
    if (this.currentRound >= this.maxRounds) {
      return { error: 'Game over' };
    }
    this.addPlayer(playerId);
    const posKey = row + ',' + col;
    if (this.revealed.has(posKey)) {
      return { score: 0, message: 'Already revealed' };
    }
    const result = this.revealCell(row, col);
    if (result === null) {
      return { error: 'Invalid move' };
    }
    if (result === -1) {
      // hit mine
      this.scores.set(playerId, this.scores.get(playerId) - 2);
      return { score: -2, message: 'Hit a mine' };
    } else {
      // safe cell
      this.scores.set(playerId, this.scores.get(playerId) + 1);
      return { score: 1, message: 'Safe cell', count: result };
    }
  }

  nextRound() {
    this.currentRound++;
    if (this.currentRound >= this.maxRounds) {
      return { gameOver: true, scores: this.getScores() };
    }
    return { gameOver: false, currentRound: this.currentRound };
  }

  getScores() {
    const result = {};
    for (const [playerId, score] of this.scores.entries()) {
      result[playerId] = score;
    }
    return result;
  }
}

module.exports = MinesArenaGame;