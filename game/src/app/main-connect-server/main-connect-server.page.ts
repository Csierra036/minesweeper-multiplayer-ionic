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

// Componente para la página principal de conexión al servidor
export class MainConnectServerPage implements OnInit {
  // IP del servidor ingresada por el usuario
  serverIp: string = '';
  // Puerto del servidor ingresado por el usuario
  serverPort: string = '';

  // Inyección de dependencias: servicio de juego, enrutador y notificaciones
  constructor(
    private gameService: GameService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Método del ciclo de vida: aquí podrías inicializar datos si es necesario
  }

  // Guarda la información ingresada por el usuario (IP y puerto del servidor)
  SaveInfo() {
    const serverData = {
      serverIp: this.serverIp,
      serverPort: this.serverPort,
    };

    return serverData;
  }

  // Intenta conectarse al servidor con los datos ingresados
  async JoinRoom() {
    // Valida que ambos campos estén completos
    if (!this.serverIp || !this.serverPort) {
      this.toastService.createToast(
        'Por favor completa IP y puerto',
        'warning'
      );
      return;
    }
    // Muestra mensaje de intento de conexión
    this.toastService.createToast(
      `Conectando a ${this.serverIp}:${this.serverPort}`,
      'warning'
    );
    // Llama al servicio para conectar al servidor
    const connected = await this.gameService.connectToServer(
      this.serverIp,
      this.serverPort
    );
    // Si la conexión fue exitosa, navega a la pantalla principal
    if (connected) {
      this.router.navigate(['/home']);
    }
  }
}
