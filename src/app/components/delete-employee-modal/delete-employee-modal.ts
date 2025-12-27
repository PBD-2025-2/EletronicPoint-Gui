import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../services/employee.service';

@Component({
  selector: 'app-delete-employee-modal',
  templateUrl: './delete-employee-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./delete-employee-modal.scss']
})

export class DeleteEmployeeModalComponent {
  @Input() modalTitle = 'Delete Employee';

  @Input() employee!: Employee;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<{id: number}>();

  close() {
    this.closeModal.emit();
  }

  delete() {
    this.deleteItem.emit({
      id: this.employee.id,
    });
  }
}
