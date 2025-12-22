import { Component } from '@angular/core';
import { RosterApi } from '../roster-api.model.ts/roster-api-model';
import { Roster } from '../../services/register-roster-service';

@Component({
  selector: 'app-roster.mapper.ts',
  imports: [],
  templateUrl: './roster.mapper.ts.html',
  styleUrl: './roster.mapper.ts.scss'
})


export class RosterMapper {

  static fromApi(api: RosterApi): Roster {
    return {
      id: api.id,
      name: api.name,
      type: api.type,
      weeklyWorkload: api.weeklyWorkload,
      dailySchedules: api.schedules ?? [],
      dutySchedules: api.dutySchedules ?? []
    };
  }


  static fromApiList(apiList: RosterApi[]): Roster[] {
    return apiList.map(r => this.fromApi(r));
  }
}