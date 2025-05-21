import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Board } from './board';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class GamePage implements OnInit {
  board: Board = new Board();
  constructor() {
  }

  ngOnInit() {
    this.board = new Board();
    this.board.setMinesRandom(); // colocar minas
    this.board.calculateAdjacentMines(); // calcular números
  }

  openCellOnBoard(row: number, col: number) {
    if (this.board.gameOver) return;

    const cell = this.board.table[row][col];
    if (cell.revelated || cell.flag) return;

    this.board.openCell(row, col);

    // Opcional: si cae en mina, marcar el juego como terminado
    if (cell.mine) {
      this.board.gameOver = true;
      alert('💥 ¡Perdiste!');
    }
  }

  get table() {
    return this.board.table;
  }

}
