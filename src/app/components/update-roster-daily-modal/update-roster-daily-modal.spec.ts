import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateRosterDailyModalComponent } from './update-roster-daily-modal';

describe('UpdateEmployeeRolesModal', () => {
  let component: UpdateRosterDailyModalComponent;
  let fixture: ComponentFixture<UpdateRosterDailyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRosterDailyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRosterDailyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should uptaded', () => {
    expect(component).toBeTruthy();
  });
});
