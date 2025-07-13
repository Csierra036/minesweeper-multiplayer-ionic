import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Inyecta el controlador de toasts de Ionic
  constructor(private toastController: ToastController) {}

  // Método para crear y mostrar un toast (mensaje flotante)
  async createToast(message: string, color: string) {
    // Crea el toast con el mensaje, duración y color especificados
    const toast = await this.toastController.create({
      message,
      duration: 3000, // tiempo en milisegundos que se muestra el toast
      position: 'bottom', // posición del toast: 'top', 'middle', 'bottom'
      color, // color del toast: 'success', 'warning', 'danger', etc.
    });

    // Muestra el toast en pantalla
    await toast.present();
  }
}
