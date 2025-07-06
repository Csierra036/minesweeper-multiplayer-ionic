import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonCard, IonTitle, IonHeader, IonToolbar, IonModal} from '@ionic/angular/standalone';
import { scoreBoard } from './board-pieces/scoreBoard';
import { GameService } from '../services/game.service';
import { StatusGameDto } from './status_game/stateGame.dto';
import { ActivatedRoute } from '@angular/router';
import { Board } from './board-pieces/board';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonCard, IonTitle, IonToolbar, IonHeader, IonModal]
})


export class GamePage implements OnInit {
  statusGame: StatusGameDto = new StatusGameDto();
  playerOneStats: scoreBoard = new scoreBoard();
  playerTwoStats: scoreBoard = new scoreBoard();
  activeFlagMode: boolean = false;
  player: number = 0;
  finishModal = true;
  constructor(
    private readonly gameService: GameService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {
      this.playerOneStats.turn = true;
  }


  async ngOnInit() {
    const board = await this.gameService.getBoard(this.statusGame.boardGame);
    if (!board) {
      console.error('Error al obtener el tablero');
      return;
    }
    this.statusGame.boardGame = board;

    this.route.queryParams.subscribe(params => {
      this.player = +params['turn'] || 1;
    });

    this.gameService.onGameStatusUpdate((status) => {
      console.log(status)
      let board: Board = new Board()
      this.statusGame.boardGame = board.DeserializeJson(status.boardGame)
      this.statusGame.turnGame = status.turnGame;

      if(this.statusGame.boardGame.gameOver === true){

      }
      this.toastService.createToast(`Turn of the player ${status.turnGame}`,'secondary');
    });
  }


  openCellOnBoard(row: number, col: number) {
    if(this.statusGame.turnGame !== this.player){
      this.toastService.createToast("Is not your turn", 'warning');
      return;
    }

    if (this.activeFlagMode) {
      this.gameService.setFlagOnBoard(row, col, this.statusGame);
    } else {
      this.gameService.openCellOnBoard(row, col, this.statusGame);
    }
  }


  activateFlagMode() {
    if(this.statusGame.turnGame !== this.player){
      this.toastService.createToast("Is not your turn", 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.activeFlagMode(this.activeFlagMode);
  }


  desactivateFlagMode() {
    if(this.statusGame.turnGame !== this.player){
      this.toastService.createToast("Is not your turn", 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.desactiveFlagMode(this.activeFlagMode);
  }


  restartGame() {
    this.finishModal = false;
    this.toastService.createToast("Partida reiniciada", 'success');
  }

  
  exitGame() {
    this.finishModal = false;
  }

}
