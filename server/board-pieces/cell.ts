// Clase que representa una celda individual del tablero de Buscaminas (lado servidor)
export class Cell {
  // Indica si la celda contiene una mina
  mine: boolean = false;
  // Indica si la celda ya fue revelada
  revelated: boolean = false;
  // Estado de la bandera: 0 = sin bandera, 1 = bandera colocada, 2 = posible interrogación
  flag: number = 0;
  // Número de minas adyacentes a esta celda
  adjacentMines: number = 0;
}
