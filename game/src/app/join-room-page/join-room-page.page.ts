import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-join-room-page',
  templateUrl: './join-room-page.page.html',
  styleUrls: ['./join-room-page.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    CommonModule,
    FormsModule,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    RouterModule,
  ],
})

// Componente para la página de unirse a una sala existente
export class JoinRoomPagePage implements OnInit {
  // Código de la sala ingresado por el usuario
  codeRoom: string = '';

  // Inyección de dependencias: servicios de juego, enrutador y notificaciones
  constructor(
    private gameService: GameService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Método del ciclo de vida: aquí podrías inicializar datos si es necesario
  }

  // Guarda la información ingresada por el usuario (código de sala)
  SaveInfo() {
    const serverData = {
      codeRoom: this.codeRoom,
    };

    return serverData;
  }

  // Método para intentar unirse a una sala usando el código ingresado
  JoinRoom() {
    const serverData = this.SaveInfo();
    // Aquí podrías llamar a un método del servicio para validar el código y navegar
    // Ejemplo: this.gameService.joinRoom(serverData).then(...)
  }
}
