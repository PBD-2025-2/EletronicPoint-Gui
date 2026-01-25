import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-sector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sector-modal.html',
  styleUrl: './add-sector-modal.scss'
})
export class AddSectorModalComponent {
    @Input() modalTitle = 'Add Sector';

    @Input() secondLabel = 'Document';
    @Input() secondPlaceholder = '';

    @Input() secondKey = 'document';

    @Output() closeModal = new EventEmitter<void>();
    @Output() saveItem = new EventEmitter<{ name: string; cnpj: string }>();

    name = '';
    cnpj = '';

    close() {
      this.closeModal.emit();
    }

    save() {
      this.saveItem.emit({
        name: this.name,
        cnpj: this.cnpj
      });
    }

}
