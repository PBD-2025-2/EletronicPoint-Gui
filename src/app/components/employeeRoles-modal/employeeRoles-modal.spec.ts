import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRolesComponent } from './employeeRoles-modal';

describe('employeeRolesComponent', () => {
  let component: EmployeeRolesComponent;
  let fixture: ComponentFixture<EmployeeRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should view', () => {
    expect(component).toBeTruthy();
  });
});
