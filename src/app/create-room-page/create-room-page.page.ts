import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Board } from '../game/board';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.page.html',
  styleUrls: ['./create-room-page.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton]
})
export class CreateRoomPagePage implements OnInit {
  size: number = 0;
  mines: number = 0;
  board: Board;

  constructor(private gameService: GameService, private router: Router) {
    this.board = new Board();
  }

  ngOnInit() {
  }

  setDifficulty(size: number, mines: number) {
    this.board.table = []; // reinicia el tablero
    this.board.setDifficulty(size, mines);
    this.board.setMinesRandom();
    this.board.calculateAdjacentMines(); // calcular números
    
    this.gameService.setBoard(this.board);
    this.router.navigate(['/join-room-page']);
  }
}