import { Board } from '../board-pieces/board';

// DTO (Data Transfer Object) que representa el estado del juego para enviar o recibir información
export class StatusGameDto {
  // Número de turno actual en la partida
  turnGame: number = 1;
  // Instancia del tablero de juego actual
  boardGame: Board = new Board();
}
