import { Component } from '@angular/core';


export interface RosterApi {
  id: number;
  name: string;
  type: string;
  weeklyWorkload: number;

  schedules?: {
    day: string;
    schedules: string[];
  }[];

  dutySchedules?: {
    startTime: string;
    workDuration: number;
    timeOff: number;
  }[];
}


({
  selector: 'app-roster-api.model.ts',
  imports: [],
  templateUrl: './roster-api.model.html',
  styleUrl: './roster-api.model.scss'
})
export class RosterApiModelTs {

}