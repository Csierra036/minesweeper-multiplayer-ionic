import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonCard,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonModal,
} from '@ionic/angular/standalone';
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
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonModal,
  ],
})
export class GamePage implements OnInit {
  statusGame: StatusGameDto = new StatusGameDto();
  playerOneStats: scoreBoard = new scoreBoard();
  playerTwoStats: scoreBoard = new scoreBoard();
  activeFlagMode: boolean = false;
  player: number = 0;
  finishModal: boolean = false;
  winner: number | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {
    this.playerOneStats.turn = true; // The game starting with the player 1
  }

  async ngOnInit() {
    // Obtain the player number from the route parameters
    this.route.queryParams.subscribe((params) => {
      this.player = +params['turn'];
    });

    const board = await this.gameService.getBoard(this.statusGame.boardGame);
    if (!board) {
      console.error('Error obtaining the board');
      this.toastService.createToast('Error loading the board', 'danger');
      return;
    }
    this.statusGame.boardGame = board;

    // Subscribe to game status updates
    this.gameService.onGameStatusUpdate((status) => {
      const board: Board = new Board();
      this.statusGame.boardGame = board.DeserializeJson(status.boardGame);
      this.statusGame.turnGame = status.turnGame;

      this.playerOneStats.turn = status.turnGame === 1;
      this.playerTwoStats.turn = status.turnGame === 2;

      if (this.statusGame.boardGame.gameOver) {
        this.gameOverEvent();
      }
    });

    // Subscribe to score updates
    this.gameService.onScoresUpdate((scores) => {
      this.updateScores(scores);
    });

    // Obtener los scores iniciales
    const currentScores = await this.gameService.getCurrentScores();
    this.updateScores(currentScores);
  }

  get boardSizeClass(): string {
    const cols = this.statusGame.boardGame?.size || 0;

    if (cols >= 2 && cols <= 12) return 'board-30';
    if (cols >= 13 && cols <= 20) return 'board-20';
    if (cols >= 21 && cols <= 26) return 'board-15';
    if (cols >= 27 && cols <= 32) return 'board-12';
    return 'board-10';
  }

  /**
   * Updates local scores with server data
   * @param scores - Object that manages players' scores
   */
  updateScores(scores: { [key: number]: scoreBoard }) {
    if (scores[1]) {
      this.playerOneStats.minesOpen = scores[1].minesOpen;
      this.playerOneStats.flagSets = scores[1].flagSets;
      this.playerOneStats.correctFlags = scores[1].correctFlags;
      this.playerOneStats.hitMine = scores[1].hitMine;
      this.playerOneStats.turn = scores[1].turn;
    }
    if (scores[2]) {
      this.playerTwoStats.minesOpen = scores[2].minesOpen;
      this.playerTwoStats.flagSets = scores[2].flagSets;
      this.playerTwoStats.correctFlags = scores[2].correctFlags;
      this.playerTwoStats.hitMine = scores[2].hitMine;
      this.playerTwoStats.turn = scores[2].turn;
    }
  }

  async openCellOnBoard(row: number, col: number) {
    if (this.player == 0) return;

    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast("It's not your turn", 'warning');
      return;
    }

    try {
      if (this.activeFlagMode) {
        const cell = this.statusGame.boardGame.table[row][col];

        if (cell.flag === this.player) {
          this.gameService.removeFlagOnBoard(row, col, this.statusGame);
          await this.updateFlagCount(-1);

          if (cell.mine) {
            await this.updateCorrectFlagsCount(-1);
          }
        } else if (!cell.flag) {
          this.gameService.setFlagOnBoard(row, col, this.statusGame);
          await this.updateFlagCount(1);

          if (cell.mine) {
            await this.updateCorrectFlagsCount(1);
          }
        } else {
          this.toastService.createToast(
            'The cell does not have your flag',
            'warning'
          );
        }
      } else {
        const cell = this.statusGame.boardGame.table[row][col];
        if (!cell.flag) {
          const cellsOpened = this.gameService.openCellOnBoard(
            row,
            col,
            this.statusGame
          );

          if (cellsOpened) {
            await this.updateMinesCount(cellsOpened);
          }

          if (cell.mine) {
            if (this.player === 1) {
              this.playerOneStats.hitMine = true;
            } else {
              this.playerTwoStats.hitMine = true;
            }
            await this.syncScores();

            this.statusGame.boardGame.gameOver = true;
            this.gameOverEvent();
            return;
          }
        } else {
          this.toastService.createToast(
            'There is a flag in this cell',
            'warning'
          );
        }
      }

      if (this.statusGame.boardGame.gameOver) {
        this.gameOverEvent();
      }
    } catch (error) {
      this.toastService.createToast('Error when making a move', 'danger');
      console.error('Error in openCellOnBoard:', error);
    }
  }
  async updateFlagCount(flagNumber: number = 1) {
    if (this.player === 1) {
      this.playerOneStats.flagSets += flagNumber;
    } else {
      this.playerTwoStats.flagSets += flagNumber;
    }
    await this.syncScores();
  }

  async updateCorrectFlagsCount(delta: number = 1) {
    if (this.player === 1) {
      this.playerOneStats.correctFlags += delta;
    } else {
      this.playerTwoStats.correctFlags += delta;
    }
    await this.syncScores();
  }

  async updateMinesCount(cellsOpened: number) {
    if (this.player === 1) {
      this.playerOneStats.minesOpen += cellsOpened;
    } else {
      this.playerTwoStats.minesOpen += cellsOpened;
    }
    await this.syncScores();
  }

  async syncScores() {
    try {
      await this.gameService.updatePlayerScores(
        this.player,
        this.player === 1 ? this.playerOneStats : this.playerTwoStats
      );
    } catch (error) {
      this.toastService.createToast('Error updating score', 'danger');
    }
  }

  gameOverEvent() {
    this.finishModal = true;

    if (this.playerOneStats.hitMine) {
      this.winner = 2;
      return;
    }
    if (this.playerTwoStats.hitMine) {
      this.winner = 1;
      return;
    }

    if (this.playerOneStats.minesOpen > this.playerTwoStats.minesOpen) {
      this.winner = 1;
    } else if (this.playerTwoStats.minesOpen > this.playerOneStats.minesOpen) {
      this.winner = 2;
    } else {
      if (this.playerOneStats.correctFlags > this.playerTwoStats.correctFlags) {
        this.winner = 1;
      } else if (
        this.playerTwoStats.correctFlags > this.playerOneStats.correctFlags
      ) {
        this.winner = 2;
      } else {
        this.winner = null;
      }
    }
  }

  activateFlagMode() {
    if (this.player === 0) return;

    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast("It's not your turn", 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.activeFlagMode(this.activeFlagMode);
  }

  desactivateFlagMode() {
    console.log(this.player);
    if (this.player === 0) return;

    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast("It's not your turn", 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.desactiveFlagMode(
      this.activeFlagMode
    );
  }

  async restartGame() {
    if (this.player === 0) return;

    try {
      this.playerOneStats.resetScoreBoard();
      this.playerTwoStats.resetScoreBoard();

      this.statusGame = new StatusGameDto();
      this.finishModal = false;
      this.winner = null;
      this.activeFlagMode = false;
      await this.gameService.resetAllScores();

      const board = await this.gameService.getBoard(this.statusGame.boardGame);
      if (board) {
        this.statusGame.boardGame = board;
      }

      this.toastService.createToast('Game restarted', 'success');
    } catch (error) {
      this.toastService.createToast('Error when restarting game', 'danger');
    }
  }

  exitGame() {
    this.finishModal = false;
  }

  getGameOverMessage(): string {
    if (this.playerOneStats.hitMine) {
      return 'Player 1 hit a mine! Player 2 wins!';
    }
    if (this.playerTwoStats.hitMine) {
      return 'Player 2 hit a mine! Player 1 wins!';
    }
    if (this.winner === 1) return 'Player one wins!';
    if (this.winner === 2) return 'Player two wins!';
    return 'Draw!';
  }
}
