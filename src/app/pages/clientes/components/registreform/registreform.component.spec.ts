import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreformComponent } from './registreform.component';

describe('RegistreformComponent', () => {
  let component: RegistreformComponent;
  let fixture: ComponentFixture<RegistreformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistreformComponent]
    });
    fixture = TestBed.createComponent(RegistreformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
