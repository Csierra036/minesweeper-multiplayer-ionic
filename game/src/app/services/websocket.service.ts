import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Board } from '../game/board-pieces/board';
import { scoreBoard } from '../game/board-pieces/scoreBoard';
import { StatusGameDto } from '../game/status_game/stateGame.dto';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: Socket;

  constructor() {}

  connectToServer(serverIp: string, serverPort: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket = io(`http://${serverIp}:${serverPort}`, {
        transports: ['websocket'],
        rejectUnauthorized: false,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected with ID:', this.socket.id);
        resolve(true);
      });

      setTimeout(() => {
        reject(false);
      }, 5000);
    });
  }


  startedGameStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('checkStartedGame', (status: boolean) => {
        resolve(status);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }


  sendStartedGameStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveStartedGame', true, (ackResponse: boolean) => {
        resolve(ackResponse);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }
  
  
  sendEndGameStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveStartedGame', false, (ackResponse: boolean) => {
        resolve(ackResponse);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }


  sendCreatedBoard(boardGame: Board): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('saveCreateBoard', boardGame, (ackResponse: boolean) => {
        resolve(ackResponse);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

  
  getBoard(): Promise<Board | null> {
    return new Promise((resolve) => {
      this.socket.emit('getBoard', (board: Board | null) => {
        resolve(board);
      });

      setTimeout(() => {
        resolve(null);
      }, 5000);
    });
  }


  sendTurnGame(statusGame: StatusGameDto): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('followGameStatus', statusGame, (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }


  listenGameStatusUpdate(callback: (statusGame: StatusGameDto) => void): void {
    this.socket.on('statusGame', callback);
  }


  updateScores(player: number, scores: scoreBoard): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('updateScores', player, scores, (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }


  getCurrentScores(): Promise<{ [key: number]: scoreBoard }> {
    return new Promise((resolve) => {
      this.socket.emit('getScores', (scores: { [key: number]: scoreBoard }) => {
        resolve(scores);
      });

      setTimeout(() => {
        resolve({
          1: new scoreBoard(),
          2: new scoreBoard(),
        });
      }, 5000);
    });
  }


  listenForScoreUpdates(callback: (scores: { [key: number]: scoreBoard }) => void): void {
    this.socket.on('scoresUpdated', callback);
  }

  
  resetScores(): Promise<boolean> {
    return new Promise((resolve) => {
      this.socket.emit('resetScores', (ack: boolean) => {
        resolve(ack);
      });

      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }
}
