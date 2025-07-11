import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Board } from '../game/board-pieces/board';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

// Componente para la página de creación de sala
@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.page.html',
  styleUrls: ['./create-room-page.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton],
})
export class CreateRoomPagePage implements OnInit {
  // Tamaño del tablero seleccionado por el usuario
  size: number = 0;
  // Cantidad de minas seleccionada por el usuario
  mines: number = 0;
  // Instancia del tablero de juego
  board: Board;

  // Inyección de dependencias: servicio de juego y enrutador
  constructor(private gameService: GameService, private router: Router) {
    // Inicializa el tablero vacío
    this.board = new Board();
  }

  ngOnInit() {
    // Método del ciclo de vida: aquí podrías inicializar datos si es necesario
  }

  // Método para establecer la dificultad y crear el tablero
  async setDifficulty(size: number, mines: number) {
    this.board.table = []; // Reinicia el tablero
    this.board.setDifficulty(size, mines); // Establece tamaño y minas
    this.board.setMinesRandom(); // Coloca minas aleatoriamente
    this.board.calculateAdjacentMines(); // Calcula los números de casillas adyacentes

    // Envía el tablero creado al backend y espera respuesta
    const createdTable = await this.gameService.sendCreatedBoard(this.board);
    if (createdTable)
      // Si se creó correctamente, navega a la pantalla de juego con el turno 1
      this.router.navigate(['/game'], { queryParams: { turn: 1 } });
  }
}
