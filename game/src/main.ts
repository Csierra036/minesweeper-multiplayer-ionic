import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Punto de entrada principal de la aplicación Angular/Ionic
bootstrapApplication(AppComponent, {
  providers: [
    // Estrategia de reutilización de rutas específica de Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Proveedor para funcionalidades de Ionic
    provideIonicAngular(),
    // Proveedor de rutas con precarga de todos los módulos
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
