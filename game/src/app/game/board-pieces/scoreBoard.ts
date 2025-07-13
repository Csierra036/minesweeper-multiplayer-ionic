export class scoreBoard {
  minesOpen: number;
  flagSets: number;
  gameOver: boolean;
  turn: boolean;

  constructor() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.gameOver = false;
    this.turn = false;
  }

  resetScoreBoard() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.gameOver = false;
  }
}
