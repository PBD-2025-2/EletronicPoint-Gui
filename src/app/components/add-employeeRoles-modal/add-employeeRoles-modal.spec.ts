import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeRolesModal } from './add-employeeRoles-modal';

describe('AddEmployeeModal', () => {
  let component: AddEmployeeRolesModal;
  let fixture: ComponentFixture<AddEmployeeRolesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeRolesModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeRolesModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
