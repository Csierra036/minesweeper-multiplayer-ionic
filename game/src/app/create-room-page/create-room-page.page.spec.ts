import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateRoomPagePage } from './create-room-page.page';

// Describe el grupo de pruebas para el componente CreateRoomPagePage
describe('CreateRoomPagePage', () => {
  let component: CreateRoomPagePage; // Instancia del componente a probar
  let fixture: ComponentFixture<CreateRoomPagePage>; // Fixture para acceder al DOM y la instancia

  // Antes de cada prueba, configura el entorno de pruebas y crea el componente
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomPagePage); // Crea el componente en un entorno de pruebas
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección de cambios para inicializar el componente
  });

  // Prueba básica: verifica que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // El componente debe existir
  });
});
