import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { Board } from './board';
import { scoreBoard } from './scoreBoard';
import { GameService } from '../services/game.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})

export class GamePage implements OnInit {
  board: Board = new Board();
  playerOneStats: scoreBoard = new scoreBoard();
  playerTwoStats: scoreBoard = new scoreBoard();

  constructor(gameService: GameService) {
    this.board = gameService.getBoard();
  }

  ngOnInit() {}

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

  // setFlagOnBoard(row: number, col: number) {
  //   if (this.board.gameOver) return;

  //   const cell = this.board.table[row][col];
  //   if (cell.revelated) return;

  //   cell.flag = !cell.flag;
  //   this.board.scoreBoard.flagSets += cell.flag ? 1 : -1;
  // }


  get table() {
    return this.board.table;
  }

}
