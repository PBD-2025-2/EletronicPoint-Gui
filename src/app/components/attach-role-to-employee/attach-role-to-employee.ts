import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster.service';
import { EmployeeService } from '../../services/employee.service';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-attach-role-to-employee',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrl: './attach-role-to-employee.scss',
  templateUrl: './attach-role-to-employee.html',
})

export class AttachRoleToEmployee {
  @Input() title = 'Add Item';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<{ rosterName: string, roleName: string, employeeCPF: string,  companyCNPJ:string, status:string}>();

  rosterName = '';
  roleName = '';
  employeeCPF = '';
  companyCNPJ = '';
  status:string = 'Ativo';

  closeAttach() {
    this.closeModal.emit();
  }

  saveAttach() {
    this.saveItem.emit({
      rosterName: this.rosterName,
      roleName: this.roleName,
      employeeCPF: this.employeeCPF,
      companyCNPJ: this.companyCNPJ,
      status: this.status
    })
  }
}
