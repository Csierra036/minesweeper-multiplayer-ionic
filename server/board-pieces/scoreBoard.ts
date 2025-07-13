// Clase que representa el marcador y estado del juego para el Buscaminas
export class scoreBoard {
  // Número de minas abiertas por el jugador
  minesOpen: number;
  // Número de banderas colocadas por el jugador
  flagSets: number;
  // Indica si el juego ha terminado
  gameOver: boolean;
  // Indica de quién es el turno (puede usarse para multijugador)
  turn: boolean;

  // Constructor: inicializa los valores del marcador y estado
  constructor() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.gameOver = false;
    this.turn = false;
  }

  // Método para reiniciar el marcador y estado del juego
  resetScoreBoard() {
    this.minesOpen = 0;
    this.flagSets = 0;
    this.gameOver = false;
  }
}
