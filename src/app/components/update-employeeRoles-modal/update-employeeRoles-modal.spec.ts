import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEmployeeRolesModalComponent } from './update-employeeRoles-modal';

describe('UpdateEmployeeRolesModal', () => {
  let component: UpdateEmployeeRolesModalComponent;
  let fixture: ComponentFixture<UpdateEmployeeRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeeRolesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should uptaded', () => {
    expect(component).toBeTruthy();
  });
});
