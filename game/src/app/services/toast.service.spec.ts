import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

// Grupo de pruebas unitarias para el servicio ToastService
describe('ToastService', () => {
  let service: ToastService; // Instancia del servicio a probar

  // Antes de cada prueba, configura el entorno de pruebas e inyecta el servicio
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  // Prueba básica: verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
