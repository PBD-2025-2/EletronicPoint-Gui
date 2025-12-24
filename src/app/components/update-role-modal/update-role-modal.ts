import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from '../../services/role.service';

@Component({
  selector: 'app-update-role-modal',
  templateUrl: './update-role-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-role-modal.scss']
})

export class UpdateRoleModalComponent {
  @Input() modalTitle = 'Update Role';

  @Input() secondLabel = 'Document';
  @Input() secondPlaceholder = '';
  @Input() role!: Role;

  @Input() secondKey = 'document';

  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{name: string, sectorName: string}>();

  name = '';
  sectorName = '';

  close() {
    this.closeModal.emit();
  }

  update() {
    this.updateItem.emit({
      name: this.name,
      sectorName: this.sectorName,
    });
  }
}
