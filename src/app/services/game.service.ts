import { Injectable } from '@angular/core';
import { Board } from '../game/board';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  private board!: Board;
  private socket: Socket;

  constructor(){
    this.socket = io('http://localhost:8181');

    this.socket.on('mensaje', (data: string) => {
      console.log('Mensaje del servidor:', data);
      alert('Servidor dice: ' + data);
    });
  }

  //Configuration the board for select the difficulty
  setBoard(board: Board) {
    this.board = board;
  }


  //Call the changes of the board
  getBoard(): Board {
    return this.board;
  }

  //SOCKETS
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
