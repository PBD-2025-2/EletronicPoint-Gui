import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attach-role-employee-modal',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './attach-role-employee-modal.html',
  styleUrls: ['./attach-role-employee-modal.scss']
})
export class AttachRoleEmployeeModal {
  status: string = '';
  workregime: string = '';
  employeeName: string = '';
  roleName: string = '';

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<{ 
    status: string,
    workregime: string; 
    employeeName: string; 
    roleName: string; 
  }>();

  close() {
    this.closeModal.emit();
  }

  attach() {
    if (!this.workregime || !this.employeeName || !this.roleName) {
      return;
    }

    this.saveItem.emit({
      status: this.status,
      workregime: this.workregime,
      employeeName: this.employeeName,
      roleName: this.roleName
    });
  }
}
