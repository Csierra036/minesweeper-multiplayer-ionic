import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from '../game/board-pieces/board';
import { scoreBoard } from '../game/board-pieces/scoreBoard';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: Socket; // Instancia del socket para la conexión WebSocket

  constructor() {}

  /**
   * Establece conexión con el servidor WebSocket
   * @param serverIp - Dirección IP del servidor
   * @param serverPort - Puerto del servidor
   * @returns Promise que resuelve a true si la conexión es exitosa, false si falla
   */
  connectToServer(serverIp: string, serverPort: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket = io(`http://${serverIp}:${serverPort}`, {
        transports: ['websocket'],
        rejectUnauthorized: false,
      });

      this.socket.on('connect', () => {
        console.log('Socket conectado con ID:', this.socket.id);
        resolve(true);
      });

      setTimeout(() => {
        reject(false);
      }, 5000);
    });
  }

  /**
   * Envía el tablero creado al servidor
   * @param boardGame - Tablero del juego a enviar
   * @returns Promise que resuelve a true si se guardó correctamente
   */
  sendCreatedBoard(boardGame: Board): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveCreateBoard', boardGame, (ackResponse: boolean) => {
        resolve(ackResponse);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Obtiene el tablero actual del servidor
   * @returns Promise con el tablero o null si no hay tablero
   */
  getBoard(): Promise<Board | null> {
    return new Promise((resolve) => {
      this.socket.emit('getBoard', (board: Board | null) => {
        resolve(board);
      });

      setTimeout(() => {
        resolve(null);
      }, 5000);
    });
  }

  /**
   * Envía el estado del juego al servidor
   * @param statusGame - Estado actual del juego
   * @returns Promise que resuelve a true si se actualizó correctamente
   */
  sendTurnGame(statusGame: StatusGameDto): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('followGameStatus', statusGame, (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Escucha actualizaciones del estado del juego
   * @param callback - Función a ejecutar cuando llegue una actualización
   */
  listenGameStatusUpdate(callback: (statusGame: StatusGameDto) => void): void {
    this.socket.on('statusGame', callback);
  }

  // ===== MÉTODOS PARA EL SCOREBOARD =====

  /**
   * Actualiza los scores de un jugador en el servidor
   * @param player - Número de jugador (1 o 2)
   * @param scores - Objeto con los scores a actualizar
   * @returns Promise que resuelve a true si se actualizó correctamente
   */
  updateScores(player: number, scores: scoreBoard): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('updateScores', player, scores, (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Obtiene los scores actuales del servidor
   * @returns Promise con los scores de ambos jugadores
   */
  getCurrentScores(): Promise<{ [key: number]: scoreBoard }> {
    return new Promise((resolve) => {
      this.socket.emit('getScores', (scores: { [key: number]: scoreBoard }) => {
        resolve(scores);
      });

      setTimeout(() => {
        resolve({
          1: new scoreBoard(),
          2: new scoreBoard(),
        });
      }, 5000);
    });
  }

  /**
   * Escucha actualizaciones de scores desde el servidor
   * @param callback - Función a ejecutar cuando llegue una actualización
   */
  listenForScoreUpdates(
    callback: (scores: { [key: number]: scoreBoard }) => void
  ): void {
    this.socket.on('scoresUpdated', callback);
  }

  /**
   * Escucha los scores iniciales al conectarse
   * @param callback - Función a ejecutar con los scores iniciales
   */
  listenForInitialScores(
    callback: (scores: { [key: number]: scoreBoard }) => void
  ): void {
    this.socket.on('initialScores', callback);
  }

  /**
   * Reinicia los scores en el servidor
   * @returns Promise que resuelve a true si se reiniciaron correctamente
   */
  resetScores(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('resetScores', (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Desconecta el socket del servidor
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
