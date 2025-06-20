import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonCard, IonTitle} from '@ionic/angular/standalone';
import { Board } from './board';
import { scoreBoard } from './scoreBoard';
import { GameService } from '../services/game.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonIcon, IonCard, IonTitle]
})


export class GamePage implements OnInit {
  board: Board = new Board();
  playerOneStats: scoreBoard = new scoreBoard();
  playerTwoStats: scoreBoard = new scoreBoard();
  activeFlagMode: boolean = false;
  playerRound: number = 1;
  constructor(private gameService: GameService) {
    this.board = this.gameService.getBoard();
  }


  ngOnInit() {}


  openCellOnBoard(row: number, col: number) {
    if (this.activeFlagMode) {
      this.gameService.setFlagOnBoard(row, col);
    } else {
      this.gameService.openCellOnBoard(row, col);
    }
  }


  activateFlagMode() {
    this.activeFlagMode = this.gameService.activeFlagMode(this.activeFlagMode);
  }


  desactivateFlagMode() {
    this.activeFlagMode = this.gameService.desactiveFlagMode(this.activeFlagMode);
  }


  get table() {
    return this.board.table;
  }

}
