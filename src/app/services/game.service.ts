import { Injectable } from '@angular/core';
import { Board } from '../game/board';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private board!: Board;

  constructor(){}

  setBoard(board: Board) {
    this.board = board;
  }

  getBoard(): Board {
    return this.board;
  }

}
