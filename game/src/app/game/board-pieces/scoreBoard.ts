export class scoreBoard {
  minesOpen: number;
  flagSets: number;
  correctFlags: number = 0;
  hitMine: boolean;
  turn: boolean;

  constructor() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.correctFlags = 0;
    this.hitMine = false;
    this.turn = false;
  }

  resetScoreBoard() {
    this.minesOpen = 0;
    this.correctFlags = 0;
    this.flagSets = 0;
    this.hitMine = false;
  }
}
