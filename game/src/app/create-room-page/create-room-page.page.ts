import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle,IonItem,
  IonLabel, IonButtons, ModalController } from '@ionic/angular/standalone';
import { Board } from '../game/board-pieces/board';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { CustomGameModalComponent } from '../../components/custom-game-modal/custom-game-modal.component';

@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.page.html',
  styleUrls: ['./create-room-page.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton]
})

export class CreateRoomPagePage implements OnInit {
  customMines: number = 0;
  customSize: number = 0;
  board: Board;
  openCustomButton: boolean = false;

  constructor(
    private readonly gameService: GameService,
    private readonly router: Router,
    private readonly modalController: ModalController) {
    this.board = new Board();
  }

  ngOnInit() {
  }

  async setDifficulty(size: number, mines: number) {
    this.board.table = [];
    this.board.setDifficulty(size, mines);
    this.board.setMinesRandom();
    this.board.calculateAdjacentMines();
    
    const createdTable = await this.gameService.sendCreatedBoard(this.board);
    if(createdTable)
      this.router.navigate(['/game'],{queryParams: { turn: 1 }});
    }
  
    
  async openCustomModal() {
    const modal = await this.modalController.create({
      component: CustomGameModalComponent,
      componentProps: { size: 8, mines: 10 },
      cssClass: 'custom-small-modal',
      breakpoints: [0, 0.5, 1],  // Puntos de ruptura para hacerlo responsive
      initialBreakpoint: 0.5,    // Comienza en el 50% de la pantalla
      backdropDismiss: true,     // Permite cerrar haciendo clic fuera
      showBackdrop: true,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.setDifficulty(data.size, data.mines);
    }
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