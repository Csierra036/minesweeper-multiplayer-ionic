import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonCard, IonTitle} from '@ionic/angular/standalone';
import { Board } from './board-pieces/board';
import { scoreBoard } from './scoreBoard';
import { GameService } from '../services/game.service';
import { StatusGameDto } from './status_game/stateGame.dto';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonCard, IonTitle]
})


export class GamePage implements OnInit {
  statusGame: StatusGameDto = new StatusGameDto();
  playerOneStats: scoreBoard = new scoreBoard();
  playerTwoStats: scoreBoard = new scoreBoard();
  activeFlagMode: boolean = false;
  playerTurn: number = 1;

  constructor(private gameService: GameService) {
    this.playerOneStats.turn = true;
  }


  async ngOnInit() {
    const board = await this.gameService.getBoard(this.statusGame.boardGame);
    if (!board) {
      console.error('Error al obtener el tablero');
      return;
    }
    this.statusGame.boardGame = board;

    this.gameService.onGameStatusUpdate((status) => {
      this.statusGame.boardGame = status.boardGame;
      this.statusGame.playerTurn = status.playerTurn;
    });
  }


  openCellOnBoard(row: number, col: number) {
    if (this.activeFlagMode) {
      this.gameService.setFlagOnBoard(row, col, this.statusGame);
    } else {
      this.gameService.openCellOnBoard(row, col, this.statusGame);
    }
  }


  activateFlagMode() {
    this.activeFlagMode = this.gameService.activeFlagMode(this.activeFlagMode);
  }


  desactivateFlagMode() {
    this.activeFlagMode = this.gameService.desactiveFlagMode(this.activeFlagMode);
  }

}
