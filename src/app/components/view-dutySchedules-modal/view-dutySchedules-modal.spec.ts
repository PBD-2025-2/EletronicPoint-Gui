import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDutySchedulesrModalComponent } from './view-dutySchedules-modal';

describe('ViewDutySchedulesModal', () => {
  let component: ViewDutySchedulesrModalComponent;
  let fixture: ComponentFixture<ViewDutySchedulesrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDutySchedulesrModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDutySchedulesrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should view', () => {
    expect(component).toBeTruthy();
  });
});
