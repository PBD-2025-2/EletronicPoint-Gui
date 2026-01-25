import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteEmployeeRolesModalComponent } from './delete-employeeRoles-modal';

describe('DeleteEmployeeModal', () => {
  let component: DeleteEmployeeRolesModalComponent;
  let fixture: ComponentFixture<DeleteEmployeeRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEmployeeRolesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEmployeeRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete', () => {
    expect(component).toBeTruthy();
  });
});
