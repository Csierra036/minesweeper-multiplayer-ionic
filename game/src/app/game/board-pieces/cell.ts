// Clase que representa una celda individual del tablero de Buscaminas
export class Cell {
  // Indica si la celda contiene una mina
  mine: boolean = false;
  // Indica si la celda ya fue revelada
  revelated: boolean = false;
  // Estado de la bandera: 0 = sin bandera, 1 = bandera colocada, 2 = posible interrogación
  flag: number = 0;
  // Ruta de la imagen de la bandera (útil para mostrar el icono correspondiente)
  flagImage: string = '';
  // Número de minas adyacentes a esta celda
  adjacentMines: number = 0;

  // Método para obtener la ruta de la imagen de la bandera
  getFlagImage(): string {
    if (this.flag === 1) return 'assets/player_1_icon.png';
    if (this.flag === 2) return 'assets/player_2_icon.png';
    return ''; // Sin bandera
  }
}
