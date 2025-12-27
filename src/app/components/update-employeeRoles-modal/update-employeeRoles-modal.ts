import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeRoles } from '../../services/employee.service';

@Component({
  selector: 'app-update-employeeRoles-modal',
  templateUrl: './update-employeeRoles-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-employeeRoles-modal.scss']
})

export class UpdateEmployeeRolesModalComponent {
  @Input() modalTitle = 'Update Employee Roles Details';
  @Input() employeeRoles!: EmployeeRoles;

  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{rosterName: string, roleName: string, status: string}>();

  rosterName = '';
  roleName = '';
  status :string = 'Ativo';

  close() {
    this.closeModal.emit();
  }

  update() {
    this.updateItem.emit({
      rosterName: this.rosterName,
      roleName: this.roleName,
      status: this.status
    });
  }
}
