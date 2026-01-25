import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDailySchedulesrModalComponent } from './view-dailySchedules-modal';

describe('ViewSchedulesModal', () => {
  let component: ViewDailySchedulesrModalComponent;
  let fixture: ComponentFixture<ViewDailySchedulesrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDailySchedulesrModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDailySchedulesrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should view', () => {
    expect(component).toBeTruthy();
  });
});
