import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
selector: 'app-update-roster-duty-modal',
  templateUrl: './update-roster-duty-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-roster-duty-modal.scss']
})

export class UpdateRosterDutyModalComponent {
  @Input() modalTitle = 'Update Roster';
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{rosterName: string, weeklyWorkload: number, startTime: string, workDuration: number, timeOff: number}>();

  rosterName =  '';
  weeklyWorkload = 0;
  startTime = '';
  workDuration = 0;
  timeOff = 0;

  update() {
    this.updateItem.emit({
      rosterName: this.rosterName,
      weeklyWorkload: this.weeklyWorkload,
      startTime: this.startTime,
      workDuration: this.workDuration,
      timeOff: this.timeOff
    });
  }

  close() {
    this.closeModal.emit();
  }

  isFormValid() {
    if (this.verifyFormsTypes()) {
      return true;
    }
    return false;
  }

  private verifyFormsTypes() : boolean {
    if (!this.verifyStringForm() || !this.verifyNumberForm()) {
      return false;
    }

    return true;
  }

  private verifyStringForm() : boolean{
    if (!this.rosterName || !this.startTime ) {
          return false;
        }

    if (this.rosterName.trim().length === 0 || this.startTime.trim().length === 0) {
      return false;
    }

    return true;
  }

  private verifyNumberForm() : boolean{
    if (typeof this.weeklyWorkload != 'number' ||
        typeof this.workDuration != 'number' || 
        typeof this.timeOff != 'number' ) {
          return false;
        }

    if (this.weeklyWorkload <= 0 || this.workDuration <= 0 ||  this.timeOff <= 0) {
      return false;
    }

    return true;
  }
}
