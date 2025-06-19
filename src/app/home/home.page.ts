import { Component } from '@angular/core';
import {IonContent, IonButton,IonText } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonButton, RouterModule, IonText],
})
export class HomePage {
  constructor() {}
}
