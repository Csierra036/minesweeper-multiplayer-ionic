import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainConnectServerPage } from './main-connect-server.page';

describe('MainConnectServerPage', () => {
  let component: MainConnectServerPage;
  let fixture: ComponentFixture<MainConnectServerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainConnectServerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
