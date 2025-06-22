import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController){}

  async createToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // tiempo en milisegundos
      position: 'bottom', // 'top', 'middle', 'bottom'
      color // opcional: 'success', 'warning', 'danger', etc.
    });

    await toast.present();
  }
}
