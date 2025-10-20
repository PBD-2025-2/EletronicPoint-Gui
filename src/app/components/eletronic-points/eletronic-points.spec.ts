import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EletronicPoints } from './eletronic-points';

describe('EletronicPoints', () => {
  let component: EletronicPoints;
  let fixture: ComponentFixture<EletronicPoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EletronicPoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EletronicPoints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
