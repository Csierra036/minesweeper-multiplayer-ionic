import { Injectable } from '@angular/core';
import { Board } from '../game/board-pieces/board';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
@Injectable({
  providedIn: 'root'
})

export class GameService {
  private board: Board = new Board();
  constructor(private readonly toastService: ToastService,
              private readonly websocketService: WebsocketService){
    this.board = new Board();
  }

  
  async connectToServer(serverIp: string, serverPort: string): Promise<boolean> {
    let success = false;
    try {
      success = await this.websocketService.connectToServer(serverIp, serverPort);
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(`Conectado a ${serverIp}:${serverPort}`, 'success');
      return true;
    } 

    this.toastService.createToast('Error al conectar al servidor', 'danger');
    return false;
    
  }


  async sendCreatedBoard(boardGame: Board) : Promise<boolean>{
    let success = false;
    try{
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


  //Call the changes of the board
  async getBoard(){
    try{
      const boardResult = await this.websocketService.getBoard();
      if (boardResult !== null) {
        this.board.gameOver = boardResult.gameOver;
        this.board.table = boardResult.table;
        this.board.size = boardResult.size;
        this.board.mines = boardResult.mines;
        return this.board;
      }
      else {
        this.toastService.createToast('No hay tablero disponible', 'warning');
        return null;
      }

    } catch (error) {
      this.toastService.createToast('Error con el servidor', 'error');
      return null;
    }
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
