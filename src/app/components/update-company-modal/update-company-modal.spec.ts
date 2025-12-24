import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyModalComponent } from './update-company-modal';

describe('UpdateCompanyModal', () => {
  let component: UpdateCompanyModalComponent;
  let fixture: ComponentFixture<UpdateCompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompanyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
