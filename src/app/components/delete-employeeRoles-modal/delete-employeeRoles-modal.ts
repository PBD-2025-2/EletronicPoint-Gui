import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeRoles } from '../../services/employeeRoles.service';

@Component({
  selector: 'app-delete-employeeRoles-modal',
  templateUrl: './delete-employeeRoles-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./delete-employeeRoles-modal.scss']
})

export class DeleteEmployeeRolesModalComponent {
  @Input() modalTitle = 'Delete Employee Roles';

  @Input() employeeRoles!: EmployeeRoles;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<{id: number}>();

  close() {
    this.closeModal.emit();
  }

  delete() {
    this.deleteItem.emit({
      id: this.employeeRoles.id,
    });
  }
}
