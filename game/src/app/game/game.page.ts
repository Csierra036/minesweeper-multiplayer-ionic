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
  player: number = 1; // Jugador actual (1 o 2)
  finishModal: boolean = true;
  showGameOverAlert: boolean = false;
  winner: number | null = null;

  constructor(
    private readonly gameService: GameService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {
    this.playerOneStats.turn = true; // Inicialmente el jugador 1 comienza
  }

  async ngOnInit() {
    // Obtener el número de jugador de los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      this.player = +params['turn'] || 1;
    });

    // Obtener el tablero inicial
    const board = await this.gameService.getBoard(this.statusGame.boardGame);
    if (!board) {
      console.error('Error al obtener el tablero');
      this.toastService.createToast('Error al cargar el tablero', 'danger');
      return;
    }
    this.statusGame.boardGame = board;

    // Suscribirse a actualizaciones del estado del juego
    this.gameService.onGameStatusUpdate((status) => {
      const board: Board = new Board();
      this.statusGame.boardGame = board.DeserializeJson(status.boardGame);
      this.statusGame.turnGame = status.turnGame;

      // Actualizar turnos en los stats
      this.playerOneStats.turn = status.turnGame === 1;
      this.playerTwoStats.turn = status.turnGame === 2;

      if (this.statusGame.boardGame.gameOver) {
        this.handleGameOver();
      }
    });

    // Suscribirse a actualizaciones de los scores
    this.gameService.onScoresUpdate((scores) => {
      this.updateScoresFromServer(scores);
    });

    // Obtener los scores iniciales
    const currentScores = await this.gameService.getCurrentScores();
    this.updateScoresFromServer(currentScores);
  }

  /**
   * Actualiza los scores locales con los datos del servidor
   * @param scores - Objeto con los scores de ambos jugadores
   */
  private updateScoresFromServer(scores: { [key: number]: scoreBoard }) {
    if (scores[1]) {
      this.playerOneStats.minesOpen = scores[1].minesOpen;
      this.playerOneStats.flagSets = scores[1].flagSets;
      this.playerOneStats.gameOver = scores[1].gameOver;
      this.playerOneStats.turn = scores[1].turn;
    }
    if (scores[2]) {
      this.playerTwoStats.minesOpen = scores[2].minesOpen;
      this.playerTwoStats.flagSets = scores[2].flagSets;
      this.playerTwoStats.gameOver = scores[2].gameOver;
      this.playerTwoStats.turn = scores[2].turn;
    }
  }

  /**
   * Maneja la acción de abrir una celda o colocar bandera
   * @param row - Fila de la celda
   * @param col - Columna de la celda
   */
  async openCellOnBoard(row: number, col: number) {
    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast('No es tu turno', 'warning');
      return;
    }

    try {
      if (this.activeFlagMode) {
        // Elimina la asignación manual de cell.flag aquí
        // Solo llama al servicio
        this.gameService.setFlagOnBoard(row, col, this.statusGame);
        await this.updateFlagCount();
      } else {
        const cell = this.statusGame.boardGame.table[row][col];
        if (!cell.flag) {
          const cellsOpened = this.gameService.openCellOnBoard(
            row,
            col,
            this.statusGame
          );
          if (cellsOpened) await this.updateMinesCount(cellsOpened);
        } else {
          this.toastService.createToast('Retira la bandera primero', 'warning');
        }
      }

      if (this.statusGame.boardGame.gameOver) this.handleGameOver();
    } catch (error) {
      console.error('Error:', error);
      this.toastService.createToast('Error al realizar jugada', 'danger');
    }
  }
  /**
   * Actualiza el contador de banderas y sincroniza con el servidor
   */
  private async updateFlagCount() {
    if (this.player === 1) {
      this.playerOneStats.flagSets++;
    } else {
      this.playerTwoStats.flagSets++;
    }
    await this.syncScores();
  }

  /**
   * Actualiza el contador de minas abiertas y sincroniza con el servidor
   * @param cellsOpened - Número de celdas abiertas
   */
  private async updateMinesCount(cellsOpened: number) {
    if (this.player === 1) {
      this.playerOneStats.minesOpen += cellsOpened;
    } else {
      this.playerTwoStats.minesOpen += cellsOpened;
    }
    await this.syncScores();
  }

  /**
   * Sincroniza los scores con el servidor
   */
  private async syncScores() {
    try {
      await this.gameService.updatePlayerScores(
        this.player,
        this.player === 1 ? this.playerOneStats : this.playerTwoStats
      );
    } catch (error) {
      console.error('Error al sincronizar puntuación:', error);
      this.toastService.createToast('Error al actualizar puntuación', 'danger');
    }
  }

  /**
   * Maneja el fin del juego y determina al ganador
   */
  private handleGameOver() {
    this.showGameOverAlert = true;

    // Determinar el ganador basado en las minas abiertas
    if (this.playerOneStats.minesOpen > this.playerTwoStats.minesOpen) {
      this.winner = 1;
    } else if (this.playerTwoStats.minesOpen > this.playerOneStats.minesOpen) {
      this.winner = 2;
    } else {
      this.winner = null; // Empate
    }
  }

  /**
   * Activa el modo bandera
   */
  activateFlagMode() {
    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast('No es tu turno', 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.activeFlagMode(this.activeFlagMode);
  }

  /**
   * Desactiva el modo bandera
   */
  desactivateFlagMode() {
    if (this.statusGame.turnGame !== this.player) {
      this.toastService.createToast('No es tu turno', 'warning');
      return;
    }
    this.activeFlagMode = this.gameService.desactiveFlagMode(
      this.activeFlagMode
    );
  }

  /**
   * Reinicia el juego completamente
   */
  async restartGame() {
    try {
      // Reiniciar stats locales
      this.playerOneStats.resetScoreBoard();
      this.playerTwoStats.resetScoreBoard();

      // Reiniciar estado del juego
      this.statusGame = new StatusGameDto();
      this.finishModal = false;
      this.showGameOverAlert = false;
      this.winner = null;
      this.activeFlagMode = false;

      // Reiniciar scores en el servidor
      await this.gameService.resetAllScores();

      // Obtener nuevo tablero
      const board = await this.gameService.getBoard(this.statusGame.boardGame);
      if (board) {
        this.statusGame.boardGame = board;
      }

      this.toastService.createToast('Partida reiniciada', 'success');
    } catch (error) {
      console.error('Error al reiniciar juego:', error);
      this.toastService.createToast('Error al reiniciar partida', 'danger');
    }
  }

  /**
   * Cierra el modal de fin de juego
   */
  exitGame() {
    this.finishModal = false;
  }

  /**
   * Devuelve el mensaje de fin de juego según el ganador
   */
  getGameOverMessage(): string {
    if (this.winner === 1) return '¡Jugador 1 ha ganado!';
    if (this.winner === 2) return '¡Jugador 2 ha ganado!';
    return '¡El juego ha terminado en empate!';
  }
}
