import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'game',
    loadComponent: () => import('./game/game.page').then( m => m.GamePage)
  },
  {
    path: 'create-room-page',
    loadComponent: () => import('./create-room-page/create-room-page.page').then( m => m.CreateRoomPagePage)
  },
  {
    path: 'join-room-page',
    loadComponent: () => import('./join-room-page/join-room-page.page').then( m => m.JoinRoomPagePage)
  },

];
