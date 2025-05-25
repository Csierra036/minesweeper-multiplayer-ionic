import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinRoomPagePage } from './join-room-page.page';

describe('JoinRoomPagePage', () => {
  let component: JoinRoomPagePage;
  let fixture: ComponentFixture<JoinRoomPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRoomPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
