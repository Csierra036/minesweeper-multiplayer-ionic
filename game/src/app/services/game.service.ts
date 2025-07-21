import { Injectable } from '@angular/core';
import { Board } from '../game/board-pieces/board';
import { scoreBoard } from '../game/board-pieces/scoreBoard';
import { ToastService } from './toast.service';
import { WebsocketService } from './websocket.service';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(
    private readonly toastService: ToastService,
    private readonly websocketService: WebsocketService
  ) {}


  async connectToServer(serverIp: string, serverPort: string) {
    let success = false;
    try {
      success = await this.websocketService.connectToServer(
        serverIp,
        serverPort
      );
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(
        `Coonected to ${serverIp}:${serverPort}`,
        'success'
      );
      return true;
    }

    this.toastService.createToast('Error when restarting game', 'danger');
    return false;
  }


  async sendCreatedBoard(boardGame: Board): Promise<boolean> {
    let success = false;
    try {
      success = await this.websocketService.sendCreatedBoard(boardGame);
    } catch (error) {
      success = false;
    }

    if (success) {
      this.toastService.createToast(`Room created`, 'success');
      return true;
    }

    this.toastService.createToast('Error creating room', 'danger');
    return false;
  }


  async getBoard(board: Board): Promise<Board | null> {
    try {
      const boardResult = await this.websocketService.getBoard();
      if (boardResult !== null) {
        board.gameOver = boardResult.gameOver;
        board.table = boardResult.table;
        board.size = boardResult.size;
        board.mines = boardResult.mines;
        return board;
      }
      this.toastService.createToast('No board available', 'warning');
      return null;
    } catch (error) {
      this.toastService.createToast('Server error', 'danger');
      return null;
    }
  }

  
  rotateRound(player: number): number {
    if (player === 1) {
      player = 2;
      this.toastService.createToast("Player 2's turn", 'primary');
    } else if (player === 2) {
      player = 1;
      this.toastService.createToast("Player 1's turn", 'primary');
    }
    return player;
  }


  openCellOnBoard(
    row: number,
    col: number,
    gameStatus: StatusGameDto
  ): number | undefined {
    if (gameStatus.boardGame.gameOver) return;
    const cell = gameStatus.boardGame.table[row][col];
    if (cell.revelated || cell.flag) return;

    const cellsOpened = gameStatus.boardGame.openCell(row, col);
    gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);

    if (cell.mine) {
      gameStatus.boardGame.gameOver = true;
      this.toastService.createToast('You hit a mine! Game over!', 'danger');
    }

    this.websocketService.sendTurnGame(gameStatus);
    return cellsOpened;
  }


  setFlagOnBoard(row: number, col: number, gameStatus: StatusGameDto): void {
    const cell = gameStatus.boardGame.table[row][col];
    if (gameStatus.boardGame.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag === 0) {
      cell.flag = gameStatus.turnGame;
      gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
      this.websocketService.sendTurnGame(gameStatus);
    } else {
      this.toastService.createToast(
        'There is a flag in this cell',
        'warning'
      );
    }
  }


  removeFlagOnBoard(row: number, col: number, gameStatus: StatusGameDto) {
    const cell = gameStatus.boardGame.table[row][col];
    if (gameStatus.boardGame.gameOver) return;
    if (cell.revelated) return;

    if (cell.flag === gameStatus.turnGame) {
      cell.flag = 0;
      gameStatus.turnGame = this.rotateRound(gameStatus.turnGame);
      this.websocketService.sendTurnGame(gameStatus);
    } else {
      this.toastService.createToast(
        "You cannot remove the opponent's flag",
        'warning'
      );
    }
  }


  activeFlagMode(flagMode: boolean): boolean {
    if (flagMode) {
      this.toastService.createToast(
        'Flag mode is now active',
        'warning'
      );
    } else {
      flagMode = true;
      this.toastService.createToast('Flag mode activated', 'success');
    }
    return flagMode;
  }


  desactiveFlagMode(flagMode: boolean): boolean {
    if (!flagMode) {
      this.toastService.createToast(
        'Flag mode is now disabled',
        'warning'
      );
    } else {
      flagMode = false;
      this.toastService.createToast('Flag mode deactivated', 'success');
    }
    return flagMode;
  }


  onGameStatusUpdate(callback: (status: StatusGameDto) => void): void {
    this.websocketService.listenGameStatusUpdate(callback);
  }


  async updatePlayerScores(
    player: number,
    scores: scoreBoard
  ): Promise<boolean> {
    try {
      const success = await this.websocketService.updateScores(player, scores);
      return success;
    } catch (error) {
      this.toastService.createToast(
        'Connection error when updating marker',
        'warning'
      );
      return false;
    }
  }


  async getCurrentScores(): Promise<{ [key: number]: scoreBoard }> {
    try {
      return await this.websocketService.getCurrentScores();
    } catch (error) {
      this.toastService.createToast('Error obtaining markers', 'warning');
      return {
        1: new scoreBoard(),
        2: new scoreBoard(),
      };
    }
  }


  onScoresUpdate(
    callback: (scores: { [key: number]: scoreBoard }) => void
  ): void {
    this.websocketService.listenForScoreUpdates(callback);
  }


  async resetAllScores(){
    await this.websocketService.resetScores();
  }


  async finishGame(){
    await this.websocketService.sendEndGameStatus();
  }
}
