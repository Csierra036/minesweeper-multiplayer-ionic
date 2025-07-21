export class scoreBoard {
  minesOpen: number;
  flagSets: number;
  correctFlags: number = 0;
  gameOver: boolean;
  turn: boolean;

  constructor() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.correctFlags = 0;
    this.gameOver = false;
    this.turn = false;
  }

  resetScoreBoard() {
    this.minesOpen = 0;
    this.correctFlags = 0;
    this.flagSets = 0;
    this.gameOver = false;
  }
}
