import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RosterDaily, DailySchedules } from '../../services/roster.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

interface DailyScheduleTableModal {
  day: string,
  entry_1: string,
  exit_1: string,
  entry_2: string | null,
  exit_2: string | null,
}

@Component({
  selector: 'app-view-dailySchedules-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatFormFieldModule],
  templateUrl: './view-dailySchedules-modal.html',
  styleUrls: ['./view-dailySchedules-modal.scss']
})

export class ViewDailySchedulesrModalComponent {

  displayedColumns: string[] = ['day', 'entry1', 'exit1', 'entry2', 'exit2'];
  dataSource = new MatTableDataSource<DailyScheduleTableModal>();

  @Input() selectedRoster!: RosterDaily;
  @Output() closeModal = new EventEmitter<void>();

  ngOnChanges() {
      if (this.selectedRoster) {
        this.dataSource.data =  this.mapToTableModal(this.selectedRoster.schedules);
        console.log("DataSource: ", this.dataSource.data)
        console.log("SelectedRoster: ", this.selectedRoster)
      }
    }

  close() {
    this.closeModal.emit();
  }

  private parseTimeRange(register: string) {
    if (!register) {
      return {startTime:'-', endTime:'-'};
    }

    const [startTime, endTime] = register.split('-');

    if (!startTime || !endTime) {
      throw new Error('Formato inválido. Use HH:mm-HH:mm');
    }

    return {startTime, endTime};
  }

  private mapToTableModal(dailySchedules: DailySchedules[]): DailyScheduleTableModal[] {
    return dailySchedules.map(data => {
      const firstRegisters = this.parseTimeRange(data.schedules[0]);
      const secondRegisters = this.parseTimeRange(data.schedules[1]);

      const dailyScheduleTableModal = {
        day: data.day.toLocaleUpperCase(),
        entry_1: firstRegisters.startTime,
        exit_1: firstRegisters.endTime,
        entry_2: secondRegisters.startTime,
        exit_2: secondRegisters.endTime,
      }

      return dailyScheduleTableModal
    })
  }
}
