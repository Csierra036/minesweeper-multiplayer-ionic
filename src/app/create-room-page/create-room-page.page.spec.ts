import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateRoomPagePage } from './create-room-page.page';

describe('CreateRoomPagePage', () => {
  let component: CreateRoomPagePage;
  let fixture: ComponentFixture<CreateRoomPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
