import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,IonButton],
})
export class HomePage {
  private socket: Socket;
  constructor() {
    this.socket = io('http://localhost:8181');

    // Escuchar mensaje del servidor
    this.socket.on('mensaje', (data: string) => {
      console.log('Mensaje del servidor:', data);
      alert('Servidor dice: ' + data);
    });
  }

  enviarMensaje() {
    this.socket.emit('mensaje_cliente', 'Hola desde Ionic!');
  }
}
