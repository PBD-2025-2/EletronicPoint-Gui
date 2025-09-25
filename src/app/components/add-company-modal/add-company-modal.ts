import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./add-company-modal.scss']
})
export class AddCompanyModalComponent {
  @Output() closeModal = new EventEmitter();
  @Output() addCompany = new EventEmitter<{name:string, cnpj:string}>();

  name = '';
  cnpj = '';

  close() {
    this.closeModal.emit();
  }

  save() {
    this.addCompany.emit({ name: this.name, cnpj: this.cnpj });
    this.close();
  }
}
