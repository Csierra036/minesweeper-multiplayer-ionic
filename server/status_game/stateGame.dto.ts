import { Board } from "../board-pieces/board";
export class StatusGameDto{
    gameTurn: number = 0;
    boardGame: Board = new Board(); 
}