import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCompanyModalComponent } from './delete-company-modal';

describe('DeleteCompanyModal', () => {
  let component: DeleteCompanyModalComponent;
  let fixture: ComponentFixture<DeleteCompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCompanyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete', () => {
    expect(component).toBeTruthy();
  });
});
