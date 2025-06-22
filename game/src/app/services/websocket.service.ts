import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from '../game/board';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket!: Socket;

  constructor() {}

  connectToServer(serverIp: string, serverPort: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.socket = io(`http://${serverIp}:${serverPort}`, {
        transports: ['websocket'],
        rejectUnauthorized: false
      });

    this.socket.on('connect', () => {
      console.log('Socket conectado con ID:', this.socket.id);
      resolve(true);
    });

    setTimeout(() => {
        reject(false);
      }, 5000); //seconds
    });
  }


  sendCreatedBoard(boardGame: Board): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveCreateBoard', boardGame, (ackResponse: boolean) => {
        if (ackResponse === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      // Seguridad por si no hay respuesta del servidor
      setTimeout(() => {
        resolve(false); // ✅ nunca uses reject con un booleano
      }, 5000);
    });
  }


  getBoard(): Promise<Board | null> {
    return new Promise((resolve) => {
      this.socket.emit('getBoard', (board: Board | null) => {
        if (board) {
          resolve(board);
        } else {
          resolve(null);
        }
      });

      // Seguridad por si no hay respuesta del servidor
      setTimeout(() => {
        resolve(null); // ✅ nunca uses reject con un booleano
      }, 5000);
    });
  }

}
