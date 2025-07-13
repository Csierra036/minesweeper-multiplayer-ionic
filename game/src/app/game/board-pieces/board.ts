import { Cell } from './cell';

// Clase principal que representa el tablero de Buscaminas
export class Board {
  // Indica si el juego terminó
  gameOver = false;
  // Matriz bidimensional de celdas
  table: Cell[][] = [];
  // Número total de minas en el tablero
  mines: number = 0;
  // Tamaño del tablero (n x n)
  size: number = 0;

  // Constructor vacío, se inicializa con setDifficulty
  constructor() {}

  // Establece el tamaño del tablero y la cantidad de minas, y crea la matriz de celdas vacía
  setDifficulty(size: number, mines: number) {
    this.size = size;
    this.mines = mines;
    this.table = [];
    // Crea la matriz de celdas vacías
    for (let i = 0; i < size; i++) {
      this.table[i] = [];
      for (let j = 0; j < size; j++) {
        this.table[i][j] = new Cell();
      }
    }
  }

  // Coloca minas aleatoriamente en el tablero
  setMinesRandom() {
    let plant_mines = 0;
    while (plant_mines < this.mines) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      const cell = this.table[x][y];
      // Solo coloca una mina si la celda aún no tiene
      if (!cell.mine) {
        cell.mine = true;
        plant_mines++;
      }
    }
  }

  // Calcula el número de minas adyacentes para cada celda
  calculateAdjacentMines() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.table[i][j].mine) {
          this.table[i][j].adjacentMines = -1; // Marca con -1 si es mina
          continue;
        }
        let count = 0;
        // Recorre las 8 posiciones vecinas
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const ni = i + dx;
            const nj = j + dy;
            // Verifica que esté dentro de los límites y que sea una mina
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

  // Abre una celda; si no tiene minas adyacentes, abre recursivamente las vecinas
  openCell(row: number, col: number): number {
    const cell = this.table[row][col];
    if (cell.revelated || cell.flag) return 0;

    let cellsOpened = 1; // Contamos esta celda
    cell.revelated = true;

    if (cell.adjacentMines === 0 && !cell.mine) {
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

  // Deserializa un objeto JSON a una instancia de Board
  DeserializeJson(data: any): Board {
    const board = new Board();
    board.gameOver = data.gameOver;
    board.size = data.size;
    board.mines = data.mines;
    board.table = data.table;
    return board;
  }
}
