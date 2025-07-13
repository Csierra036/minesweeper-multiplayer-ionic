import { Routes } from '@angular/router';

// Definición de las rutas principales de la aplicación
export const routes: Routes = [
  {
    // Ruta raíz: redirige a la página de conexión al servidor
    path: '',
    redirectTo: 'main-connect-server',
    pathMatch: 'full',
  },
  {
    // Ruta para la página principal (home)
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    // Ruta para la página del juego
    path: 'game',
    loadComponent: () => import('./game/game.page').then((m) => m.GamePage),
  },
  {
    // Ruta para la página de creación de sala
    path: 'create-room-page',
    loadComponent: () =>
      import('./create-room-page/create-room-page.page').then(
        (m) => m.CreateRoomPagePage
      ),
  },
  {
    // Ruta para la página de unirse a una sala
    path: 'join-room-page',
    loadComponent: () =>
      import('./join-room-page/join-room-page.page').then(
        (m) => m.JoinRoomPagePage
      ),
  },
  {
    // Ruta para la página de conexión al servidor
    path: 'main-connect-server',
    loadComponent: () =>
      import('./main-connect-server/main-connect-server.page').then(
        (m) => m.MainConnectServerPage
      ),
  },
];
