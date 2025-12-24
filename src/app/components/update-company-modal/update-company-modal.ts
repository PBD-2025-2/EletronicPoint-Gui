import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../services/company.service';

@Component({
  selector: 'app-update-company-modal',
  templateUrl: './update-company-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-company-modal.scss']
})

export class UpdateCompanyModalComponent {
  @Input() modalTitle = 'Update Company';

  @Input() secondLabel = 'Document';
  @Input() secondPlaceholder = '';
  @Input() company!: Company;

  @Input() secondKey = 'document';

  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{name: string, cnpj: string}>();

  name = '';
  cnpj = '';

  close() {
    this.closeModal.emit();
  }

  update() {
    this.updateItem.emit({
      name: this.name,
      cnpj: this.cnpj,
    });
  }
}
