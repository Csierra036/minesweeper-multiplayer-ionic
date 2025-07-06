import { Injectable } from '@angular/core';
import { Board } from '../game/board-pieces/board';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
import { StatusGameDto } from '../game/status_game/stateGame.dto';
@Injectable({
  providedIn: 'root'
})

export class GameService {
  constructor(private readonly toastService: ToastService,
              private readonly websocketService: WebsocketService){
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
  async getBoard(board: Board){
    try{
      const boardResult = await this.websocketService.getBoard();
      if (boardResult !== null) {
        board.gameOver = boardResult.gameOver;
        board.table = boardResult.table;
        board.size = boardResult.size;
        board.mines = boardResult.mines;
        return board;
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


  openCellOnBoard(row: number, col: number, gameStatus: StatusGameDto) {
    if (gameStatus.boardGame.gameOver) return;
    const cell = gameStatus.boardGame.table[row][col];
    if (cell.revelated || cell.flag) return;

    gameStatus.boardGame.openCell(row, col);
    gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
    this.websocketService.sendTurnGame(gameStatus)
    // Opcional: si cae en mina, marcar el juego como terminado
    if (cell.mine) {
      gameStatus.boardGame.gameOver = true;
      alert('💥 ¡Perdiste!');
    }
  }


  setFlagOnBoard(row: number, col: number, gameStatus: StatusGameDto) {
    const cell = gameStatus.boardGame.table[row][col];
    if (gameStatus.boardGame.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag == 0){
      gameStatus.boardGame.table[row][col].flag = 1;
      gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
      this.websocketService.sendTurnGame(gameStatus)
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


  onGameStatusUpdate(callback: (status: StatusGameDto) => void): void {
    this.websocketService.listenGameStatusUpdate(callback);
  }
}
