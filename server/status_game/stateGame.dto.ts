import { Board } from "../board-pieces/board";
export class StatusGameDto{
    playerTurn: number = 0;
    boardGame: Board = new Board(); 
}