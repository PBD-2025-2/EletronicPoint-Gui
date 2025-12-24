import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AddRoleEvent {
  name: string;
  companyName: string;
  sectorName: string;
}

@Component({
  selector: 'app-add-role-modal',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './add-role-modal.html',
  styleUrl: './add-role-modal.scss'
})
export class AddRoleModalComponent {

  @Input() title = 'Add Role';
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<any>();

  name = '';
  companyName = '';
  sectorName = '';

  saving = false;

  closeAddRole() {
    this.closeModal.emit();
  }

  saveAddRole() {
    this.saveItem.emit({
      name: this.name.trim(),
      companyName: this.companyName.trim(),
      sectorName: this.sectorName.trim(),
    });
  }
}
