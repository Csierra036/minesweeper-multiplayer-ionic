import { Injectable } from '@angular/core';
import { Board } from '../game/board';
import { io, Socket } from 'socket.io-client';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
@Injectable({
  providedIn: 'root'
})

export class GameService {
  private board!: Board;
  
  constructor(private readonly toastService: ToastService,
              private readonly websocketService: WebsocketService){}

  
  connectToServer(serverIp: string, serverPort: string) {
    this.websocketService.connectToServer(serverIp, serverPort);
  }


  sendCreatedBoard(boardGame: Board) {
    this.websocketService.sendCreatedBoard(boardGame);
  }


  joinRoomCreated(serverIp: string, serverPort: string): boolean{
    this.connectToServer(serverIp, serverPort);
    const boardExist = this.websocketService.checkBoardExist();
    
    if(!boardExist){
      this.toastService.createToast('Room has not been created', 'danger');
      return false;
    }
    return true;
  }


  //Call the changes of the board
  getBoard(): Board {
    return this.board;
  }


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


  openCellOnBoard(row: number, col: number) {
    if (this.board.gameOver) return;

    const cell = this.board.table[row][col];
    if (cell.revelated || cell.flag) return;

    this.board.openCell(row, col);

    // Opcional: si cae en mina, marcar el juego como terminado
    if (cell.mine) {
      this.board.gameOver = true;
      alert('💥 ¡Perdiste!');
    }
  }


  setFlagOnBoard(row: number, col: number) {
    const cell = this.board.table[row][col];
    if (this.board.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag == 0){
      this.board.table[row][col].flag = 1;
      // this.sendMessage('flagChange', { row, col, flag: cell.flag });
    }
    else{
      this.toastService.createToast('Ya hay una bandera en esta celda', 'warning');
    }
  }

  
  activeFlagMode(flagMode: boolean){
    if(flagMode === true){
      this.toastService.createToast('El modo bandera ya esta activo', 'warning');
    }
    else{
      flagMode = true;
      this.toastService.createToast('Modo bandera activado', 'success');
    }
    return flagMode;
  }


  desactiveFlagMode(flagMode: boolean){
    if(flagMode === false){
      this.toastService.createToast('El modo bandera ya esta desactivado', 'warning');
    }
    else{
      flagMode = false;
      this.toastService.createToast('Modo bandera desactivado', 'success');
    }
    return flagMode;
  }
}
