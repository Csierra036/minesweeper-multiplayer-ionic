export class Cell {
  mine: boolean = false;
  revelated: boolean = false;
  flag: number = 0;
  adjacentMines: number = 0;

  
  getFlagImage(): string {
    if (this.flag === 1) return 'assets/player_1_icon.png';
    if (this.flag === 2) return 'assets/player_2_icon.png';
    return '';
  }
}
