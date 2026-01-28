import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateRosterDutyModalComponent } from './update-roster-duty-modal';

describe('UpdateEmployeeRolesModal', () => {
  let component: UpdateRosterDutyModalComponent;
  let fixture: ComponentFixture<UpdateRosterDutyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRosterDutyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRosterDutyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should uptaded', () => {
    expect(component).toBeTruthy();
  });
});
