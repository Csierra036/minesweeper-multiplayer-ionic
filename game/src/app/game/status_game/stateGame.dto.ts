import { Board } from "../board-pieces/board";
export class StatusGameDto{
    turnGame: number = 1;
    boardGame: Board = new Board(); 
}