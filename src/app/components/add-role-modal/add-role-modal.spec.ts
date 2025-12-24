import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleModalComponent } from './add-role-modal';

describe('AddRoleModal', () => {
  let component: AddRoleModalComponent;
  let fixture: ComponentFixture<AddRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
