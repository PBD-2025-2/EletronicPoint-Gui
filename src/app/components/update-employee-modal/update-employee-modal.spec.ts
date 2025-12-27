import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEmployeeModalComponent } from './update-employee-modal';

describe('UpdateEmployeeModal', () => {
  let component: UpdateEmployeeModalComponent;
  let fixture: ComponentFixture<UpdateEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should uptaded', () => {
    expect(component).toBeTruthy();
  });
});
