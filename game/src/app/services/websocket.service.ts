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
