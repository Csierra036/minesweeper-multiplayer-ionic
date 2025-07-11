import { TestBed } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';

// Grupo de pruebas unitarias para el servicio WebsocketService
describe('WebsocketService', () => {
  let service: WebsocketService; // Instancia del servicio a probar

  // Antes de cada prueba, configura el entorno de pruebas e inyecta el servicio
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketService);
  });

  // Prueba básica: verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
