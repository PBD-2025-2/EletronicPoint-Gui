import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, filter, first, noop, Observable, throwError } from 'rxjs';
import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Roster {
  name: string;
  type: string;
  weeklyWorkload: number;
  dailySchedules: {
      day: string,
      schedules: [string]
  }[];
  dutySchedules: [
  {
    startTime: string,
    workDuration: number,
    timeOff: number
  }]
}

export interface RosterDuty {
  name: string;
  weeklyWorkload: number;
  dailySchedules: {
      startTime: string,
      workDuration: number,
      timeOff: number
  }[]
}

export interface DailyRoster {
  name: string;
  type: string;
  weeklyWorkload: number;
  dailySchedules: {
      day: string,
      schedules: [string]
    }[];
}

@Injectable({
  providedIn: 'root'
})

export class RosterService {
  private apiUrlRosters = `${environment.apiUrl}/eletronicPoint/api/v1/rosters`;
  constructor(private http: HttpClient) {}

  getRosters(): Observable<Roster[]> {
    return this.http.get<Roster[]>(this.apiUrlRosters);
  }
  
  searchRoster(term: string): Observable<Roster[]> {
    const encodedTerm = encodeURIComponent(term.trim());
    const urlByName = `${this.apiUrlRosters}/name/${encodedTerm}`;
    const urlById   = `${this.apiUrlRosters}/id/${encodedTerm}`;
  
    const safeGet = (url: string) =>
      this.http.get<Roster[]>(url).pipe(catchError(err => throwError(() => err)));
  
    const safeGetId = (url: string) =>
      this.http.get<Roster>(url).pipe(
        map(c => c ? [c] : []),
        catchError(err => throwError(() => err))
    );
  
    const requests = [
      safeGet(urlByName),
      safeGetId(urlById)
    ];
  
    return concat(...requests).pipe(
      filter(arr => Array.isArray(arr) && arr.length > 0), 
      first(),
      defaultIfEmpty([]) 
    );
  }

  searchRosterByName(rosterName: string): Observable<Roster[]> {
    const encName = encodeURIComponent(rosterName.trim());
    const url = `${this.apiUrlRosters}/name/${encName}`;

    // The API returns an object, so transform it into an array
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
  
  searchRosterById(rosterId: string): Observable<Roster[]> {
    const encId = encodeURIComponent(rosterId.trim());
    const url = `${this.apiUrlRosters}/id/${encId}`;

    return this.http.get<Roster>(url).pipe(
      map(r => {
        if (!r) {
          throw new Error("RosterID not found")
        }
        return [r]
      }),
      catchError(err => throwError(() => err))
    );
  }

   createDailyRoster(
      newDailyRoster: { 
        name: string; 
        weeklyWorkload: number; 
        dailySchedules: {
          day: string,
          schedules: [string]
        }}): Observable<DailyRoster> {
          return this.http.post<DailyRoster>(`${this.apiUrlRosters}/daily`, newDailyRoster);
      }

    createRosterDuty(
      newRosterDuty: { 
        name: string; 
        weeklyWorkload: number; 
        dutySchedules: {
          startTime: string,
          workDuration: number,
          timeOff: number
        }}): Observable<RosterDuty> {
          return this.http.post<RosterDuty>(`${this.apiUrlRosters}/duty`, newRosterDuty);
      }
}
