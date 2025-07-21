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
  constructor(
    private readonly router: Router,
    private readonly webSocketService: WebsocketService,
    private readonly toastService: ToastService
  ) {}

  goToCreateRoom() {
    this.router.navigate(['/create-room-page']);
  }

  
  async goToJoinRoom() {
    const gameStarted = await this.webSocketService.startedGameStatus();
    if(gameStarted){
      this.router.navigate(['/game'],{queryParams: { turn: 2 }})
    }
    else{
      this.toastService.createToast("Room not created", 'danger')
    }
  }


  async goToJoinAsSpectator() {
    const gameStarted = await this.webSocketService.startedGameStatus();
    if(gameStarted){
      this.router.navigate(['/game'],{queryParams: { turn: 0 }})
      this.toastService.createToast("Modo spectator actived", 'success')
    }
    else{
      this.toastService.createToast("Room not created", 'danger')
    }
  }
}