import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTitle, IonInput, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-join-room-page',
  templateUrl: './join-room-page.page.html',
  styleUrls: ['./join-room-page.page.scss'],
  standalone: true,
  imports: [ IonContent, IonTitle, CommonModule, FormsModule, IonInput,
    IonItem, IonLabel, IonButton, RouterModule,
  ],
})

export class JoinRoomPagePage implements OnInit { 
  codeRoom: string = '';

  constructor(
    private gameService: GameService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
  }

  
  SaveInfo() {
    const serverData = {
      codeRoom: this.codeRoom,
    };

    return serverData;
  }

  
  JoinRoom() {
    const serverData = this.SaveInfo();
  }
}
