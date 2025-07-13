import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';

// Grupo de pruebas unitarias para el servicio GameService
describe('GameService', () => {
  let service: GameService; // Instancia del servicio a probar

  // Antes de cada prueba, configura el entorno de pruebas e inyecta el servicio
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  // Prueba básica: verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
