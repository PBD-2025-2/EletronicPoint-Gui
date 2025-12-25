import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeModal } from './add-employee-modal';

describe('AddEmployeeModal', () => {
  let component: AddEmployeeModal;
  let fixture: ComponentFixture<AddEmployeeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEmployeeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmployeeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
