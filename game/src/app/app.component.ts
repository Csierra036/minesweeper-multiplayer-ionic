import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GamePage } from './game/game.page';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true
})
export class AppComponent {
  constructor(private platform: Platform) {
    // this.initializeApp();
    this.showSplash();
  }

  // private async initializeApp() {
  //   await this.platform.ready();
    
  //   // Fuerza el modo claro de manera más robusta
  //   document.body.classList.remove('dark');
  //   document.body.classList.add('light');
    
  //   // Configuración adicional para evitar el modo oscuro
  //   if (this.platform.is('android') || this.platform.is('ios')) {
  //     document.documentElement.style.setProperty(
  //       'color-scheme', 
  //       'light'
  //     );
  // //   }
    
  //   await this.showSplash();
  // }

  private async showSplash() {
    try {
      await SplashScreen.show({
        autoHide: true,
        showDuration: 3000
      });
    } catch (e) {
      console.warn('Error showing splash', e);
    }
  }
}