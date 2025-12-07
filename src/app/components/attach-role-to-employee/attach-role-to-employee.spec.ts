import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachRoleToEmployee } from './attach-role-to-employee';

describe('AttachRoleToEmployee', () => {
  let component: AttachRoleToEmployee;
  let fixture: ComponentFixture<AttachRoleToEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachRoleToEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachRoleToEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
