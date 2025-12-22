import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterApiModelTs } from './roster-api-model';

describe('RosterApiModelTs', () => {
  let component: RosterApiModelTs;
  let fixture: ComponentFixture<RosterApiModelTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterApiModelTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosterApiModelTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});