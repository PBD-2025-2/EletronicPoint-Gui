import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-new-roster-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-roster-modal.html',
  styleUrls: ['./create-new-roster-modal.scss']
})


export class CreateNewRosterModal {
  rosterName: string = '';
  weeklyWorkload: number | null = null;

  rosterType: 'daily' | 'duty' = 'daily';

  constructor(private notificationService: NotificationService) {}

  dutySchedules = {
    startTime: '',
    workDuration: 0,
    timeOff: 0
  };

  dailySchedules: {
    day: string;
    schedules: { start: string; end: string }[];
  }[] = [
    { day: '', schedules: [{ start: '', end: '' }] }
  ];


  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<
  |
    { // Roster Daily
    rosterName: string;
    weeklyWorkload: number;
    dailySchedules: { day: string; schedules: string[] }[];
  } | 
    { // Roster Duty 
      rosterName: string;
      weeklyWorkload: number;
      dutySchedules: {
        startTime: string;
        workDuration: number;
        timeOff: number;
      };
    }>();


  close() {
    this.closeModal.emit();
  }

  // Add new day (maximum 7)
  addDay() {
    if (this.dailySchedules.length >= 7) return;
    this.dailySchedules.push({ day: '', schedules: [{ start: '', end: '' }] });
  }

  // Add new interval (maximum 2 per day)
  addSchedule(dayIndex: number) {
    if (this.dailySchedules[dayIndex].schedules.length >= 2) return;
    this.dailySchedules[dayIndex].schedules.push({ start: '', end: '' });
  }

  removeDay(index: number) {
    this.dailySchedules.splice(index, 1);
  }

  removeSchedule(dayIndex: number, schedIndex: number) {
    this.dailySchedules[dayIndex].schedules.splice(schedIndex, 1);
  }

  attach() {
    if (!this.rosterName || !this.weeklyWorkload) {
    return;
  }
  
  if (this.rosterType === 'daily') {

    const validDays = this.dailySchedules
      .filter(d => d.day.trim())
      .map(d => ({
        day: d.day.trim(),

        schedules: d.schedules
          .filter(s => s.start && s.end)
          .map(s => `${s.start}-${s.end}`)
      }))

      .filter(d => d.schedules.length > 0);

    const hasIncomplete = this.dailySchedules.some(d =>
      d.schedules.some(s => (s.start && !s.end) || (!s.start && s.end))
    );

    if (hasIncomplete) {
      this.notificationService.showError("Please fill all of the inverval times (start and end).");
      return;
    }

    if (validDays.length === 0) {
      this.notificationService.showError("Please provide at least one day with valid schedules.");
      return;
    }

    const mappedSchedules = this.dailySchedules.map(d => ({
      day: d.day,
      schedules: d.schedules.filter(s => s.start && s.end).map(s => `${s.start}-${s.end}`)
    }));
    
    this.saveItem.emit({
      rosterName: this.rosterName,
      weeklyWorkload: this.weeklyWorkload,
      dailySchedules: mappedSchedules
    });
  } else if (this.rosterType === 'duty') {

    if (
      !this.dutySchedules.startTime || this.dutySchedules.workDuration <= 0 
      || this.dutySchedules.timeOff < 0  || this.weeklyWorkload < 0
    ) {
      this.notificationService.showError("Please provide valid duty schedule details.");
    }

    const { startTime, workDuration, timeOff } = this.dutySchedules;

    if (!startTime || workDuration <= 0 || timeOff < 0) {
      return;
    }

    this.saveItem.emit({
      rosterName: this.rosterName,
      weeklyWorkload: this.weeklyWorkload,
      dutySchedules: {
        startTime,
        workDuration,
        timeOff
      }
    });
    }
  }
}
