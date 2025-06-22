import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from '../game/board';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: Socket;

  constructor() {}

  connectToServer(serverIp: string, serverPort: string) {
      this.socket = io(`http://${serverIp}:${serverPort}`,{
        transports: ['websocket'], // Fuerza WebSocket,
        rejectUnauthorized: false
      });
  
      this.socket.on('mensaje', (data: string) => {
        console.log('Mensaje del servidor:', data);
        alert('Servidor dice: ' + data);
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
