import { Cell } from "./cell";

const MINES = 10;
const SIZE = 8;


export class Board{
    gameOver= false;
    table: Cell[][] = [];
    constructor() {
        this.table = [];

        for(let i=0; i<SIZE; i++){
            this.table[i]= [];
            for(let j=0; j<SIZE; j++){
                this.table[i][j] = new Cell();

            }
        }
    }


    setMinesRandom() {
        let plant_mines = 0;
        while (plant_mines < MINES) {
        const x = Math.floor(Math.random() * SIZE);
        const y = Math.floor(Math.random() * SIZE);
        const cell = this.table[x][y];

        if (!cell.mine) {
            cell.mine = true;
            plant_mines++;
        }
        }
    }


    calculateAdjacentMines() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
            if (this.table[i][j].mine) {
                this.table[i][j].adjacentMines = -1; // opcional: marca con -1 las minas
                continue;
            }

            let count = 0;

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                const ni = i + dx;
                const nj = j + dy;

                // Verifica que esté dentro de los límites y que sea una mina
                if (
                    ni >= 0 &&
                    ni < SIZE &&
                    nj >= 0 &&
                    nj < SIZE &&
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

    openCell(row: number, col: number){
        const cell = this.table[row][col]

        //if the cell is revelated or have a flag
        if (cell.revelated || cell.flag) return;
        
        cell.revelated = true;

        if (cell.adjacentMines === 0 && !cell.mine) {
            for (let dRow = -1; dRow <= 1; dRow++) {
                for (let dCol = -1; dCol <= 1; dCol++) {
                    const neighborRow = row + dRow;
                    const neighborCol = col + dCol;

                    // Saltar la propia celda
                    if (dRow === 0 && dCol === 0) continue;

                    // Verifica que esté dentro del tablero
                    const inBounds =
                    neighborRow >= 0 && neighborRow < SIZE &&
                    neighborCol >= 0 && neighborCol < SIZE;

                    if (inBounds) {
                        this.openCell(neighborRow, neighborCol);
                    }
                }
            }
        }
    }

    // reveal(row: number, col: number) {
    //     if (this.gameOver) return;

    //     const cell = this.board.table[row][col];
    //     this.board.revealCell(row, col);

    //     if (cell.mine) {
    //         this.gameOver = true;
    //         alert('💥 ¡Perdiste! Tocaste una mina.');
    //         // Opcional: mostrar todas las minas
    //         this.revealAllMines();
    //     }
    //     }
}