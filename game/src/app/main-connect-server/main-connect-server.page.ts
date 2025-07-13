import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonTitle,
  IonLabel,
  IonItem,
  IonButton,
} from '@ionic/angular/standalone';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-main-connect-server',
  templateUrl: './main-connect-server.page.html',
  styleUrls: ['./main-connect-server.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    CommonModule,
    FormsModule,
    IonLabel,
    IonItem,
    IonButton,
    IonInput,
  ],
})

export class MainConnectServerPage implements OnInit {
  serverIp: string = '';
  serverPort: string = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
  }


  SaveInfo() {
    const serverData = {
      serverIp: this.serverIp,
      serverPort: this.serverPort,
    };

    return serverData;
  }
  

  async JoinRoom() {

    if (!this.serverIp || !this.serverPort) {
      this.toastService.createToast(
        'Por favor completa IP y puerto',
        'warning'
      );
      return;
    }

    this.toastService.createToast(
      `Conectando a ${this.serverIp}:${this.serverPort}`,
      'warning'
    );
    
    const connected = await this.gameService.connectToServer(
      this.serverIp,
      this.serverPort
    );
  
    if (connected) {
      this.router.navigate(['/home']);
    }
  }
}
