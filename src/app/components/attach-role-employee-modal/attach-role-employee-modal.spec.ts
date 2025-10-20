import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachRoleEmployeeModal } from './attach-role-employee-modal';

describe('AttachRoleEmployeeModal', () => {
  let component: AttachRoleEmployeeModal;
  let fixture: ComponentFixture<AttachRoleEmployeeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachRoleEmployeeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachRoleEmployeeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
