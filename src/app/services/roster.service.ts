import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Roster {
  id: number
  name: string;
  type: string;
  weeklyWorkload: number;

  dailySchedules?: {
    day: string,
    schedules: string[]
  }[];

  dutySchedules?:
  {
    startTime: string,
    workDuration: number,
    timeOff: number
  };
}

export interface RosterDuty {
  id: number;
  name: string;
  weeklyWorkload: number;
  schedules: {
    startTime: string,
    workDuration: number,
    timeOff: number
  }
}

export interface DailyRoster {
  id: number;
  name: string;
  type: string;
  weeklyWorkload: number;
  schedules: DailySchedules[]
}

export interface DailySchedules {
    day: string;
    schedules: string[];
}

@Injectable({
  providedIn: 'root'
})

export class RosterService {
  private apiUrlRosters = `${environment.apiUrl}/eletronicPoint/api/v1/rosters`;
  constructor(private http: HttpClient) { }

  searchRoster(term: string): Observable<Roster[]> {
    const trimmed = term.trim();

    if (/^\d+$/.test(trimmed)) {
      return this.searchRosterById(trimmed);
    }

    return this.searchRosterByName(term);
  }

  getRosters(): Observable<Roster[]> {
    return this.http.get<Roster[]>(this.apiUrlRosters);
  }

  searchRosterById(idRoster: string): Observable<Roster[]> {
    return this.http.get<Roster>(`${this.apiUrlRosters}/id/${idRoster}`).pipe(
      map(c => c ? [c] : [])
    );
  }


  searchRosterByName(rosterName: string): Observable<Roster[]> {
    const encName = encodeURIComponent(rosterName.trim());
    const url = `${this.apiUrlRosters}/name/${encName}`;
    console.log("url: ", url)
    return this.http.get<Roster>(url).pipe(
      map(r => {
        if (!r) {
          throw new Error("Roster not found")
        }
        return [r]
      }),
      catchError(err => throwError(() => err))
    );
  }

  createDailyRoster(newDailyRoster: {
    name: string;
    weeklyWorkload: number;
    schedules: { day: string; schedules: string[] }[]; // <- agora string[]
  }): Observable<DailyRoster> {
    return this.http.post<DailyRoster>(`${this.apiUrlRosters}/daily`, newDailyRoster);
  }



  createRosterDuty(
    newRosterDuty: {
      name: string;
      weeklyWorkload: number;
      schedules: {
        startTime: string,
        workDuration: number,
        timeOff: number
      }
    }): Observable<RosterDuty> {
    return this.http.post<RosterDuty>(`${this.apiUrlRosters}/duty`, newRosterDuty);
  }


  getRosterByName(rosterName: string): Observable<Roster[]> {
    const encoded = encodeURIComponent(rosterName.trim());

    return this.http.get<Roster[]>(`${this.apiUrlRosters}/name/${encoded}`).pipe(
      map(r => {
        if (!r) {
          throw new Error('Roster not found');
        }
        return r;
      })
    );
  }
}
