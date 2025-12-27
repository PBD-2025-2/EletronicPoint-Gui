import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../services/employee.service';

@Component({
  selector: 'app-update-employee-modal',
  templateUrl: './update-employee-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-employee-modal.scss']
})

export class UpdateEmployeeModalComponent {
  @Input() modalTitle = 'Update Employee';

  @Input() secondLabel = 'Document';
  @Input() secondPlaceholder = '';
  @Input() employee!: Employee;

  @Input() secondKey = 'document';

  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{name: string, cpf: string}>();

  name = '';
  cpf = '';

  close() {
    this.closeModal.emit();
  }

  update() {
    this.updateItem.emit({
      name: this.name,
      cpf: this.cpf,
    });
  }
}
