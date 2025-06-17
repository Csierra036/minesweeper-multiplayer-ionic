import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GamePage } from './game/game.page';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GamePage],
})
export class AppComponent {
  constructor() {
    this.showSplash()
  }

  async showSplash(){
  await SplashScreen.show({
    autoHide: true,
    showDuration: 3000
  });
  }
}
