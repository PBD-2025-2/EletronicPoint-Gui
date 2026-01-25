import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

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

  constructor(private http: HttpClient) {}

  searchEmployees(term: string): Observable<any> {
    const trimmed = term.trim();

    if (/^\d+$/.test(trimmed)) {

      if (trimmed.length === 11) {
        return this.getEmployeeByCpf(trimmed);
      }

      return this.getEmployeeById(trimmed);
    }

    return this.getEmployeeByName(trimmed)
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrlEmployee).pipe(
          catchError(err => throwError(() => err)));;
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
  
  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    console.log("Adding employee:", employee);

    return this.http.post<Employee>(this.apiUrlEmployee, employee).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrlEmployee}/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrlEmployee}/${id}`);
  }
}