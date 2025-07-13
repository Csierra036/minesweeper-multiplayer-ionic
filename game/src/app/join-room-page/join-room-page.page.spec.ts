import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinRoomPagePage } from './join-room-page.page';

// Grupo de pruebas unitarias para el componente JoinRoomPagePage
describe('JoinRoomPagePage', () => {
  let component: JoinRoomPagePage; // Instancia del componente a probar
  let fixture: ComponentFixture<JoinRoomPagePage>; // Fixture para acceder al DOM y la instancia

  // Antes de cada prueba, configura el entorno de pruebas y crea el componente
  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRoomPagePage); // Crea el componente en un entorno de pruebas
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección de cambios para inicializar el componente
  });

  // Prueba básica: verifica que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // El componente debe ser creado
  });
});
