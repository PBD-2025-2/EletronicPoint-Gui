import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEmployeeModalComponent } from './delete-employee-modal';

describe('DeleteEmployeeModal', () => {
  let component: DeleteEmployeeModalComponent;
  let fixture: ComponentFixture<DeleteEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmployeeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete', () => {
    expect(component).toBeTruthy();
  });
});
