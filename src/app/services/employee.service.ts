import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, filter, first, noop, Observable } from 'rxjs';
import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Employee {
  id: number;
  name: string;
  cpf: string;
}

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/eletronicPoint/api/v1/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  searchEmployees(term: string): Observable<Employee[]> {
    
    const encodedTerm = encodeURIComponent(term.trim());
    const urlByName = `${this.apiUrl}/name/${encodedTerm}`;
    const urlByCpf = `${this.apiUrl}/cpf/${encodedTerm}`;
    const urlById   = `${this.apiUrl}/id/${encodedTerm}`;

    const safeGet = (url: string) =>
        this.http.get<Employee[]>(url).pipe(catchError(() => of([])));

    const safeGetId = (url: string) =>
        this.http.get<Employee>(url).pipe(
        map(c => c ? [c] : []),
        catchError(() => of([]))
    );

    const requests = [
        safeGet(urlByName),
        safeGet(urlByCpf),
        safeGetId(urlById)
    ];
    return concat(...requests).pipe(
        filter(arr => Array.isArray(arr) && arr.length > 0), 
        first(),
        defaultIfEmpty([]) 
    );
  }

  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee);
  } 
}
