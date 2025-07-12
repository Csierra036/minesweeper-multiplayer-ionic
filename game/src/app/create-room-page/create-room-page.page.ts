import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle,IonItem, IonLabel, IonButtons } from '@ionic/angular/standalone';
import { Board } from '../game/board-pieces/board';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.page.html',
  styleUrls: ['./create-room-page.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonModal, IonHeader,
    IonToolbar, IonTitle, IonItem, IonLabel, IonButtons]
})

export class CreateRoomPagePage implements OnInit {
  customSize: number = 0;
  customMines: number = 0;
  board: Board;
  openCustomButton: boolean = false;

  constructor(private gameService: GameService, private router: Router) {
    this.board = new Board();
  }

  ngOnInit() {
  }

  async setDifficulty(size: number, mines: number) {
    this.board.table = []; // reinicia el tablero
    this.board.setDifficulty(size, mines);
    this.board.setMinesRandom();
    this.board.calculateAdjacentMines(); // calcular números
    
    const createdTable = await this.gameService.sendCreatedBoard(this.board);
    if(createdTable)
      this.router.navigate(['/game'],{queryParams: { turn: 1 }});
    }
  
    
  openCustomModal(){
    this.openCustomButton = true; 
  }

  confirmCustomGame() {
    const maxMines = this.customSize * this.customSize - 1;
    if (this.customSize < 2 || this.customMines < 1 || this.customMines > maxMines) {
      alert(`Valores inválidos. Tamaño mínimo 2 y minas entre 1 y ${maxMines}.`);
      return;
    }
    this.openCustomButton = false;
    this.setDifficulty(this.customSize, this.customMines);
  }
}