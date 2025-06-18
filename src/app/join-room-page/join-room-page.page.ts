import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonInput, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-join-room-page',
  templateUrl: './join-room-page.page.html',
  styleUrls: ['./join-room-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonInput, IonItem, IonLabel, IonButton, RouterModule]
})


export class JoinRoomPagePage implements OnInit {
  serverIp: string = '';
  serverPort: string = '';
  constructor(private gameService: GameService, private router: Router, private toastService: ToastService) { }

  ngOnInit() {
  }


  SaveInfo() {
    const serverData = {
      serverIp: this.serverIp,
      serverPort: this.serverPort
    };

    return serverData;
  }


  JoinRoom() {
    const serverData = this.SaveInfo();
    const serverCreated = this.gameService.joinRoomCreated(serverData.serverIp, serverData.serverPort);
    
    if(serverCreated){
      this.router.navigate(['/game']);
    }
    else{
      this.toastService.createToast('No se ha creado la sala', 'danger');
    }
  }

}
