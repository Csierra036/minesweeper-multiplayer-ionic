import { Component } from '@angular/core';
import { IonImg, IonTitle, IonContent, IonButton,IonText } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonTitle, IonContent, IonButton, RouterModule, IonText, IonImg],
})
export class HomePage {
  constructor() {}
}
