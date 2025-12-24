import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleModalComponent } from './update-role-modal';

describe('UpdateCompanyModal', () => {
  let component: UpdateRoleModalComponent;
  let fixture: ComponentFixture<UpdateRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRoleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should uptaded', () => {
    expect(component).toBeTruthy();
  });
});
