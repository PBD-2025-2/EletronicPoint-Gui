import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DailySchedules, RosterDuty } from '../../services/roster.service';


@Component({
selector: 'app-update-roster-daily-modal',
  templateUrl: './update-roster-daily-modal.html',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  styleUrls: ['./update-roster-daily-modal.scss']
})

export class UpdateRosterDailyModalComponent {
  @Input() modalTitle = 'Update Roster';
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<{rosterName: string; weeklyWorkload: number; dailySchedules: { day: string; schedules: string[] }[];} >();

  daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  dailySchedules: {
    day: string;
    schedules: { start: string; end: string }[];
  }[] = [
    { 
      day: '', 
      schedules: [{ start: '', end: '' }] }
  ];

  rosterName =  '';
  weeklyWorkload = 0;
  day = ''
  schedules : string[] = []

  protected addDay() {
    if (this.dailySchedules.length >= 7) return;
    this.dailySchedules.push({ day: '', schedules: [{ start: '', end: '' }] });
  }

  protected isDayDisabled(day: string, index: number): boolean {
    return this.dailySchedules.some((d, i) => i !== index && d.day === day);
  }

  protected addSchedule(dayIndex: number) {
    if (this.dailySchedules[dayIndex].schedules.length >= 2) return;
    this.dailySchedules[dayIndex].schedules.push({ start: '', end: '' });
  }

  protected removeDay(index: number) {
    this.dailySchedules.splice(index, 1);
  }

  protected removeSchedule(dayIndex: number, schedIndex: number) {
    if (this.dailySchedules[dayIndex].schedules.length == 1) {
      return
    }

    this.dailySchedules[dayIndex].schedules.splice(schedIndex, 1);
  }

  update() {
    this.updateItem.emit({
      rosterName: this.rosterName,
      weeklyWorkload: this.weeklyWorkload,
      dailySchedules: this.mapSchedules()
    });
  }

  close() {
    this.closeModal.emit();
  }

  isFormValid() {
    if (!this.verifyStringForm() || !this.verifyNumberForm() || !this.verifyDailySchedules()) {
      return false;
    }
    return true;
  }

  private verifyStringForm() : boolean{
    if (!this.rosterName ) {
          return false;
        }

    if (this.rosterName.trim().length === 0) {
      return false;
    }

    return true;
  }

  private verifyNumberForm() : boolean {
    if (typeof this.weeklyWorkload != 'number') {
          return false;
        }

    if (this.weeklyWorkload <= 0) {
      return false;
    }

    return true;
  }

  private verifyDailySchedules() : boolean {

    return this.dailySchedules.every(data =>
      data.day?.trim() && data.schedules?.length > 0 && 
      data.schedules.every(schedulesCurrent => 
        schedulesCurrent.start && schedulesCurrent.end)
    );
  }

  private mapSchedules() {
    return this.dailySchedules.map(d => ({
      day: d.day,
      schedules: d.schedules.filter(s => s.start && s.end).map(s => `${s.start}-${s.end}`)
    }));
  }
}
