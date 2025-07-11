import { Injectable } from '@angular/core';
import { Board } from '../game/board-pieces/board';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // Inyecta los servicios de Toast y Websocket
  constructor(
    private readonly toastService: ToastService,
    private readonly websocketService: WebsocketService
  ) {}

  // Conecta al servidor usando la IP y puerto proporcionados
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

  // Envía el tablero creado al servidor y muestra un toast según el resultado
  async sendCreatedBoard(boardGame: Board): Promise<boolean> {
    let success = false;
    try {
      success = await this.websocketService.sendCreatedBoard(boardGame);
      console.log('Board sent successfully:', success);
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(`Room created`, 'success');
      return true;
    }

    this.toastService.createToast('Error al conectar al servidor', 'danger');
    return false;
  }

  // Solicita el tablero actual al servidor y actualiza el objeto Board local
  async getBoard(board: Board) {
    try {
      const boardResult = await this.websocketService.getBoard();
      if (boardResult !== null) {
        board.gameOver = boardResult.gameOver;
        board.table = boardResult.table;
        board.size = boardResult.size;
        board.mines = boardResult.mines;
        return board;
      } else {
        this.toastService.createToast('No hay tablero disponible', 'warning');
        return null;
      }
    } catch (error) {
      this.toastService.createToast('Error con el servidor', 'error');
      return null;
    }
  }

  // Cambia el turno entre jugador 1 y 2, mostrando un toast informativo
  rotateRound(player: number) {
    if (player === 1) {
      player = 2;
      this.toastService.createToast('Turno del jugador 2', 'info');
    } else if (player === 2) {
      player = 1;
      this.toastService.createToast('Turno del jugador 1', 'info');
    }
    return player;
  }

  // Lógica para abrir una celda en el tablero y actualizar el estado del juego
  openCellOnBoard(row: number, col: number, gameStatus: StatusGameDto) {
    if (gameStatus.boardGame.gameOver) return;
    const cell = gameStatus.boardGame.table[row][col];
    if (cell.revelated || cell.flag) return;

    const cellsOpened = gameStatus.boardGame.openCell(row, col);
    gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);

    if (cell.mine) {
      gameStatus.boardGame.gameOver = true;
      alert('💥 ¡Perdiste!');
    }

    this.websocketService.sendTurnGame(gameStatus);
    return cellsOpened; // Devolver el número de celdas abiertas
  }
  // Lógica para colocar una bandera en una celda
  setFlagOnBoard(row: number, col: number, gameStatus: StatusGameDto) {
    const cell = gameStatus.boardGame.table[row][col];
    if (gameStatus.boardGame.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag == 0) {
      gameStatus.boardGame.table[row][col].flag = 1;
      gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
      this.websocketService.sendTurnGame(gameStatus);
    } else {
      this.toastService.createToast(
        'Ya hay una bandera en esta celda',
        'warning'
      );
    }
  }

  // Activa el modo bandera y muestra un toast según el estado
  activeFlagMode(flagMode: boolean) {
    if (flagMode === true) {
      this.toastService.createToast(
        'El modo bandera ya esta activo',
        'warning'
      );
    } else {
      flagMode = true;
      this.toastService.createToast('Modo bandera activado', 'success');
    }
    return flagMode;
  }

  // Desactiva el modo bandera y muestra un toast según el estado
  desactiveFlagMode(flagMode: boolean) {
    if (flagMode === false) {
      this.toastService.createToast(
        'El modo bandera ya esta desactivado',
        'warning'
      );
    } else {
      flagMode = false;
      this.toastService.createToast('Modo bandera desactivado', 'success');
    }
    return flagMode;
  }

  // Suscribe a los cambios de estado del juego provenientes del servidor
  onGameStatusUpdate(callback: (status: StatusGameDto) => void): void {
    this.websocketService.listenGameStatusUpdate(callback);
  }
}
