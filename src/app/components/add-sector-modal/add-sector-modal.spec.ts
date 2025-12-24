import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSectorModalComponent } from './add-sector-modal';

describe('AddCompanySector', () => {
  let component: AddSectorModalComponent;
  let fixture: ComponentFixture<AddSectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSectorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
