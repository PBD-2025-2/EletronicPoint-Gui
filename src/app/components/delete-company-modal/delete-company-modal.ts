import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../services/company.service';

@Component({
  selector: 'app-delete-company-modal',
  templateUrl: './delete-company-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./delete-company-modal.scss']
})

export class DeleteCompanyModalComponent {
  @Input() modalTitle = 'Delete Company';

  @Input() company!: Company;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<{id: number}>();

  close() {
    this.closeModal.emit();
  }

  delete() {
    this.deleteItem.emit({
      id: this.company.id,
    });
  }
}
