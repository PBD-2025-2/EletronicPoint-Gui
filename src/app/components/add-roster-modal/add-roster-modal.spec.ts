import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRosterModalComponent } from './add-roster-modal';

describe('AttachRoleEmployeeModal', () => {
  let component: AddRosterModalComponent;
  let fixture: ComponentFixture<AddRosterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRosterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRosterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
