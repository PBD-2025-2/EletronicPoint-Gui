import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanySector } from './add-company-sector';

describe('AddCompanySector', () => {
  let component: AddCompanySector;
  let fixture: ComponentFixture<AddCompanySector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompanySector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompanySector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
