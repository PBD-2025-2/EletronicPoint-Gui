import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterMapperTs } from './roster.mapper.ts';

describe('RosterMapperTs', () => {
  let component: RosterMapperTs;
  let fixture: ComponentFixture<RosterMapperTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterMapperTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosterMapperTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
