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
      const url = `http://${serverIp}:${serverPort}`;

      this.socket = io(url, {
        transports: ['websocket'],
        rejectUnauthorized: false
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado al servidor:', this.socket.id);
        this.socket.emit('tryConnectServer');
      });

      this.socket.on('message', (response: boolean) => {
        console.log('📨 Servidor respondió:', response);
        resolve(response); // Aquí confirmamos conexión
      });

      this.socket.on('connect_error', (err) => {
        console.error('❌ Error al conectar al servidor:', err.message);
        reject(err);
      });
    });
  }


  sendCreatedBoard(boardGame: Board){
    this.socket.emit('saveCreateBoard', boardGame);
  }


  checkBoardExist(){
    let response = false;
    
    this.socket.emit('checkBoardExist');
    this.socket.on('boardExists', (boartExist: boolean) => {
      response = boartExist;
    });

    return response;
  }
}
