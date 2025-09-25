import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMenuLayout } from './default-menu-layout';

describe('DefaultMenuLayout', () => {
  let component: DefaultMenuLayout;
  let fixture: ComponentFixture<DefaultMenuLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultMenuLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultMenuLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
