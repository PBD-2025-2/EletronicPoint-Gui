import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRoleModalComponent } from './delete-role-modal';

describe('DeleteRoleModal', () => {
  let component: DeleteRoleModalComponent;
  let fixture: ComponentFixture<DeleteRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRoleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete', () => {
    expect(component).toBeTruthy();
  });
});
