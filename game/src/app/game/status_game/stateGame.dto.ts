import { Board } from "../board-pieces/board";
export class StatusGameDto{
    playerTurn: number = 1;
    boardGame: Board = new Board(); 
}