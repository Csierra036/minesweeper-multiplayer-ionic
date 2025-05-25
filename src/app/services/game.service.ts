import { Injectable } from '@angular/core';
import { Board } from '../game/board';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private board!: Board;
  private socket!: Socket;

  constructor(){}


  //Configuration the board for select the difficulty
  setBoard(board: Board) {
    this.board = board;
  }


  //Call the changes of the board
  getBoard(): Board {
    return this.board;
  }

  
  connectToServer(serverIp: string, serverPort: string) {
    this.socket = io(`http://${serverIp}:${serverPort}`);
    this.socket.on('mensaje', (data: string) => {
      console.log('Mensaje del servidor:', data);
      alert('Servidor dice: ' + data);
    });
  }


  //Join the room as player number 2
  joinRoomCreated(serverIp: string, serverPort: string): boolean{
    const isCreated = this.board !== undefined;
    
    if (isCreated) {
      this.connectToServer(serverIp, serverPort);
    }
    return isCreated;
  }
  

  sendMessage(event: string, data: any) {
    this.socket.emit(event, data);
  }


  listen(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
