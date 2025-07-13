import { Injectable } from '@angular/core';
import { Board } from '../game/board-pieces/board';
import { scoreBoard } from '../game/board-pieces/scoreBoard';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private readonly toastService: ToastService,
    private readonly websocketService: WebsocketService
  ) {}

  // ===== MÉTODOS DE CONEXIÓN Y TABLERO =====

  async connectToServer(
    serverIp: string,
    serverPort: string
  ): Promise<boolean> {
    let success = false;
    try {
      success = await this.websocketService.connectToServer(
        serverIp,
        serverPort
      );
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(
        `Conectado a ${serverIp}:${serverPort}`,
        'success'
      );
      return true;
    }

    this.toastService.createToast('Error al conectar al servidor', 'danger');
    return false;
  }

  async sendCreatedBoard(boardGame: Board): Promise<boolean> {
    let success = false;
    try {
      success = await this.websocketService.sendCreatedBoard(boardGame);
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(`Sala creada`, 'success');
      return true;
    }

    this.toastService.createToast('Error al crear sala', 'danger');
    return false;
  }

  async getBoard(board: Board): Promise<Board | null> {
    try {
      const boardResult = await this.websocketService.getBoard();
      if (boardResult !== null) {
        board.gameOver = boardResult.gameOver;
        board.table = boardResult.table;
        board.size = boardResult.size;
        board.mines = boardResult.mines;
        return board;
      }
      this.toastService.createToast('No hay tablero disponible', 'warning');
      return null;
    } catch (error) {
      this.toastService.createToast('Error con el servidor', 'error');
      return null;
    }
  }

  // ===== MÉTODOS DE JUEGO =====

  rotateRound(player: number): number {
    if (player === 1) {
      player = 2;
      this.toastService.createToast('Turno del jugador 2', 'info');
    } else if (player === 2) {
      player = 1;
      this.toastService.createToast('Turno del jugador 1', 'info');
    }
    return player;
  }

  openCellOnBoard(
    row: number,
    col: number,
    gameStatus: StatusGameDto
  ): number | undefined {
    if (gameStatus.boardGame.gameOver) return;
    const cell = gameStatus.boardGame.table[row][col];
    if (cell.revelated || cell.flag) return;

    const cellsOpened = gameStatus.boardGame.openCell(row, col);
    gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);

    if (cell.mine) {
      gameStatus.boardGame.gameOver = true;
      this.toastService.createToast('💥 ¡Has perdido!', 'danger');
    }

    this.websocketService.sendTurnGame(gameStatus);
    return cellsOpened;
  }

  setFlagOnBoard(row: number, col: number, gameStatus: StatusGameDto): void {
    const cell = gameStatus.boardGame.table[row][col];
    if (gameStatus.boardGame.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag === 0) {
      // Asignar la bandera al jugador actual (1 o 2)
      cell.flag = gameStatus.turnGame; // Usa el turno actual para determinar la bandera
      gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
      this.websocketService.sendTurnGame(gameStatus);
    } else {
      this.toastService.createToast(
        'Ya hay una bandera en esta celda',
        'warning'
      );
    }
  }

  activeFlagMode(flagMode: boolean): boolean {
    if (flagMode) {
      this.toastService.createToast(
        'El modo bandera ya está activo',
        'warning'
      );
    } else {
      flagMode = true;
      this.toastService.createToast('Modo bandera activado', 'success');
    }
    return flagMode;
  }

  desactiveFlagMode(flagMode: boolean): boolean {
    if (!flagMode) {
      this.toastService.createToast(
        'El modo bandera ya está desactivado',
        'warning'
      );
    } else {
      flagMode = false;
      this.toastService.createToast('Modo bandera desactivado', 'success');
    }
    return flagMode;
  }

  onGameStatusUpdate(callback: (status: StatusGameDto) => void): void {
    this.websocketService.listenGameStatusUpdate(callback);
  }

  // ===== MÉTODOS DE SCOREBOARD =====

  async updatePlayerScores(
    player: number,
    scores: scoreBoard
  ): Promise<boolean> {
    try {
      const success = await this.websocketService.updateScores(player, scores);
      if (success) {
        this.toastService.createToast('Marcador actualizado', 'success');
      } else {
        this.toastService.createToast(
          'Error al actualizar marcador',
          'warning'
        );
      }
      return success;
    } catch (error) {
      this.toastService.createToast(
        'Error de conexión al actualizar marcador',
        'danger'
      );
      return false;
    }
  }

  async getCurrentScores(): Promise<{ [key: number]: scoreBoard }> {
    try {
      return await this.websocketService.getCurrentScores();
    } catch (error) {
      this.toastService.createToast('Error al obtener marcadores', 'warning');
      return {
        1: new scoreBoard(),
        2: new scoreBoard(),
      };
    }
  }

  async incrementMinesOpened(
    player: number,
    currentScores: { [key: number]: scoreBoard }
  ): Promise<void> {
    const scores = currentScores[player];
    scores.minesOpen++;
    await this.updatePlayerScores(player, scores);
  }

  async incrementFlagsSet(
    player: number,
    currentScores: { [key: number]: scoreBoard }
  ): Promise<void> {
    const scores = currentScores[player];
    scores.flagSets++;
    await this.updatePlayerScores(player, scores);
  }

  async handleGameEnd(
    player: number,
    hitMine: boolean,
    currentScores: { [key: number]: scoreBoard }
  ): Promise<void> {
    const scores = currentScores[player];
    scores.gameOver = true;

    if (hitMine) {
      this.toastService.createToast(
        `¡Jugador ${player} golpeó una mina!`,
        'danger'
      );
    } else {
      this.toastService.createToast(
        `¡Jugador ${player} completó el tablero!`,
        'success'
      );
    }

    await this.updatePlayerScores(player, scores);
  }

  onScoresUpdate(
    callback: (scores: { [key: number]: scoreBoard }) => void
  ): void {
    this.websocketService.listenForScoreUpdates(callback);
  }

  onInitialScores(
    callback: (scores: { [key: number]: scoreBoard }) => void
  ): void {
    this.websocketService.listenForInitialScores(callback);
  }

  async resetAllScores(): Promise<boolean> {
    try {
      const success = await this.websocketService.resetScores();
      if (success) {
        this.toastService.createToast('Marcadores reiniciados', 'success');
      } else {
        this.toastService.createToast(
          'Error al reiniciar marcadores',
          'warning'
        );
      }
      return success;
    } catch (error) {
      this.toastService.createToast(
        'Error de conexión al reiniciar marcadores',
        'danger'
      );
      return false;
    }
  }
}
