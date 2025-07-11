import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainConnectServerPage } from './main-connect-server.page';

// Grupo de pruebas unitarias para el componente MainConnectServerPage
describe('MainConnectServerPage', () => {
  let component: MainConnectServerPage; // Instancia del componente a probar
  let fixture: ComponentFixture<MainConnectServerPage>; // Fixture para acceder al DOM y la instancia

  // Antes de cada prueba, configura el entorno de pruebas y crea el componente
  beforeEach(() => {
    fixture = TestBed.createComponent(MainConnectServerPage); // Crea el componente en un entorno de pruebas
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección de cambios para inicializar el componente
  });

  // Prueba básica: verifica que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // El componente debe existir
  });
});
