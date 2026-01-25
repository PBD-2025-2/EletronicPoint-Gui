import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RosterDuty } from '../../services/roster.service';

@Component({
  selector: 'app-view-dutySchedules-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-dutySchedules-modal.html',
  styleUrls: ['./view-dutySchedules-modal.scss']
})

export class ViewDutySchedulesrModalComponent {

  @Input() selectedRoster!: RosterDuty;
  @Output() closeModal = new EventEmitter<void>();


  close() {
    this.closeModal.emit();
  }
}
