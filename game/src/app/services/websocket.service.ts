import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from '../game/board-pieces/board';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // Instancia del socket para la comunicación en tiempo real
  private socket!: Socket;

  constructor() {}

  // Conecta al servidor usando la IP y puerto proporcionados
  connectToServer(serverIp: string, serverPort: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket = io(`http://${serverIp}:${serverPort}`, {
        transports: ['websocket'],
        rejectUnauthorized: false, // Permite conexiones sin certificado válido (desarrollo)
      });

      // Evento cuando la conexión es exitosa
      this.socket.on('connect', () => {
        console.log('Socket conectado con ID:', this.socket.id);
        resolve(true);
      });

      // Si no conecta en 5 segundos, rechaza la promesa
      setTimeout(() => {
        reject(false);
      }, 5000);
    });
  }

  // Envía el tablero creado al servidor y espera confirmación
  sendCreatedBoard(boardGame: Board): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveCreateBoard', boardGame, (ackResponse: boolean) => {
        if (ackResponse === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      // Seguridad por si no hay respuesta del servidor en 5 segundos
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  // Solicita el tablero actual al servidor
  getBoard(): Promise<Board | null> {
    return new Promise((resolve) => {
      this.socket.emit('getBoard', (board: Board | null) => {
        if (board) {
          resolve(board);
        } else {
          resolve(null);
        }
      });

      // Seguridad por si no hay respuesta del servidor en 5 segundos
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });
  }

  // Envía el estado del juego (turno, tablero, etc.) al servidor
  sendTurnGame(statusGame: StatusGameDto): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('followGameStatus', statusGame, (ack: boolean) => {
        resolve(ack === true);
      });

      // Seguridad por si no hay respuesta del servidor en 5 segundos
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  // Escucha actualizaciones del estado del juego enviadas por el servidor
  listenGameStatusUpdate(callback: (statusGame: StatusGameDto) => void): void {
    this.socket.on('statusGame', (statusGame: StatusGameDto) => {
      callback(statusGame);
    });
  }
}
