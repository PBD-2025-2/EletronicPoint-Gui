import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../services/role.service';

@Component({
  selector: 'app-delete-role-modal',
  templateUrl: './delete-role-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./delete-role-modal.scss']
})

export class DeleteRoleModalComponent {
  @Input() modalTitle = 'Delete Role';

  @Input() role!: Role;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<{id: number}>();

  close() {
    this.closeModal.emit();
  }

  delete() {
    this.deleteItem.emit({
      id: this.role.id,
    });
  }
}
