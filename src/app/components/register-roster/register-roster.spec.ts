import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRoster } from './register-roster';

describe('RegisterRoster', () => {
  let component: RegisterRoster;
  let fixture: ComponentFixture<RegisterRoster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterRoster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRoster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
