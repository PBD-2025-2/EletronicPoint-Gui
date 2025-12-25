import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee-modal.html',
  styleUrl: './add-employee-modal.scss',
})
export class AddEmployeeModal {
    @Input() modalTitle = 'Add Employee';

    @Input() secondLabel = 'Document';
    @Input() secondPlaceholder = '';

    @Input() secondKey = 'document';

    @Output() closeModal = new EventEmitter<void>();
    @Output() saveItem = new EventEmitter<{ name: string; [key: string]: string }>();

    name = '';
    secondValue = '';

    close() {
      this.closeModal.emit();
    }

    save() {
      this.saveItem.emit({
        name: this.name,
        [this.secondKey]: this.secondValue   //dynamic key
      });
    }

}
