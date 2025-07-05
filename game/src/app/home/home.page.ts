import { Component } from '@angular/core';
import {IonContent, IonButton,IonText } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { ToastService } from '../services/toast.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonButton, RouterModule, IonText],
})
export class HomePage {
  constructor(private readonly router: Router,
    private readonly webSocketService: WebsocketService,
    private readonly toastService: ToastService
  ) {}

  goToCreateRoom() {
    this.router.navigate(['/create-room-page']);
  }

  async goToJoinRoom() {
    const board = await this.webSocketService.getBoard();
    if(board?.table){
      this.router.navigate(['/game']);
    }
    else{
      this.toastService.createToast("no encontrado", 'error')
    }
    // this.router.navigate(['/join-room-page']);
  }
}