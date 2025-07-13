import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-game-modal',
  templateUrl: './custom-game-modal.component.html',
  styleUrls: ['./custom-game-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class CustomGameModalComponent {
  @Input() size: number = 8;
  @Input() mines: number = 10;

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    const maxMines = this.size * this.size - 1;
    if (this.size < 2 || this.mines < 1 || this.mines > maxMines) {
      alert(`Valores inválidos. Tamaño mínimo 2 y minas entre 1 y ${maxMines}.`);
      return;
    }

    this.modalCtrl.dismiss({ size: this.size, mines: this.mines });
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }
}