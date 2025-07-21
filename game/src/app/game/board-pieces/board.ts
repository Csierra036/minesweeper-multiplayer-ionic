import { Cell } from './cell';

export class Board {
  gameOver = false;
  table: Cell[][] = [];
  mines: number = 0;
  size: number = 0;

  constructor() {}

  setDifficulty(size: number, mines: number) {
    this.size = size;
    this.mines = mines;
    this.table = [];

    // create table with empty cells
    for (let i = 0; i < size; i++) {
      this.table[i] = [];
      for (let j = 0; j < size; j++) {
        this.table[i][j] = new Cell();
      }
    }
  }


  setMinesRandom() {
    let plant_mines = 0;
    while (plant_mines < this.mines) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      const cell = this.table[x][y];

      if (!cell.mine) {
        cell.mine = true;
        plant_mines++;
      }
    }
  }

  
  calculateAdjacentMines() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.table[i][j].mine) {
          this.table[i][j].adjacentMines = -1; // Set -1 if is a mine
          continue;
        }
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const ni = i + dx;
            const nj = j + dy;

            if (
              ni >= 0 &&
              ni < this.size &&
              nj >= 0 &&
              nj < this.size &&
              this.table[ni][nj].mine
            ) {
              count++;
            }
          }
        }
        this.table[i][j].adjacentMines = count;
      }
    }
  }


  revealAllMines() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = this.table[i][j];
        if (cell.mine) {
          cell.revelated = true;
        }
      }
    }
  }

  
  openCell(row: number, col: number): number {
    const cell = this.table[row][col];
    if (cell.revelated || cell.flag) return 0;

    //If tihe player open a mine reveal all mines
    if (cell.mine) {
      cell.revelated = true;
      this.revealAllMines();
      this.gameOver = true;
      return 1;
    }

    let cellsOpened = 1; // Count cells
    cell.revelated = true;

    if (cell.adjacentMines === 0) {
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          const neighborRow = row + dRow;
          const neighborCol = col + dCol;
          if (dRow === 0 && dCol === 0) continue;

          const inBounds =
            neighborRow >= 0 &&
            neighborRow < this.size &&
            neighborCol >= 0 &&
            neighborCol < this.size;

          if (inBounds) {
            cellsOpened += this.openCell(neighborRow, neighborCol);
          }
        }
      }
    }
    return cellsOpened;
  }

  
  DeserializeJson(data: any): Board {
    const board = new Board();
    board.gameOver = data.gameOver;
    board.size = data.size;
    board.mines = data.mines;
    board.table = data.table;
    return board;
  }
}
