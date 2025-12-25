import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface EmployeeRoles {
  id: number;
  status: string,
  roster: {
    name: string,
    type: string,
    weeklyWorkload: string,
  }
  employeeName: string,
  role: {
    name: string,
    sectors: {
      id: number,
      name: string,
      company: { name: string }
    }
  }
}

export interface Employee {
  id: number,
  name: string,
  cpf?: string;
}

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiUrlEmployee = `${environment.apiUrl}/eletronicPoint/api/v1/employees`;
  private apiUrlEmployeeRoles = `${environment.apiUrl}/eletronicPoint/api/v1/employees_roles`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrlEmployee).pipe(
          catchError(err => throwError(() => err)));;
  }

  getAllEmployeesRoles(): Observable<EmployeeRoles[]> {
    return this.http.get<EmployeeRoles[]>(this.apiUrlEmployeeRoles);
  }

  searchEmployees(term: string): Observable<any> {
    const trimmed = term.trim();

    // Input with only numbers
    if (/^\d+$/.test(trimmed)) {

      if (trimmed.length === 11) {
       return this.getEmployeeByCpf(trimmed);
      }

      return this.getEmployeeById(trimmed);
    }

    return this.getEmployeeByName(trimmed)
  }

  getEmployeeByName(name: string): Observable<Employee[]> {
    console.log("Searching employee by name:", name);
    return this.http.get<Employee[]>(`${this.apiUrlEmployee}/name/${name}`).pipe(
          catchError(err => throwError(() => err)));
  }
  
  getEmployeeByCpf(cpf: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrlEmployee}/cpf/${cpf}`).pipe(
          catchError(err => throwError(() => err)));
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    console.log("Searching employee by ID:", employeeId);
    return this.http.get<Employee>(`${this.apiUrlEmployee}/id/${employeeId}`);
  }

  getEmployeeRolesByName(name: string): Observable<EmployeeRoles[]> {
    const encoded = encodeURIComponent(name.trim());
    return this.http.get<EmployeeRoles[]>(
      `${this.apiUrlEmployeeRoles}/name/${encoded}`).pipe(
          catchError(err => throwError(() => err)));
  }
  
  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    console.log("Adding employee:", employee);

    return this.http.post<Employee>(this.apiUrlEmployee, employee).pipe(
      catchError(err => throwError(() => err))
    );
  }
}