import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface AttachRoleEmployee {
  status: boolean;
  workRegime: number;
  employeeId: number;
  roleId: number;
}

export interface Employee {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  company: { name: string };
}


@Injectable({ providedIn: 'root' })
export class AttachRoleEmployeeService {

  private apiUrlEmployeeRoles = `${environment.apiUrl}/eletronicPoint/api/v1/employees_roles`;
  private apiUrlRoles = `${environment.apiUrl}/eletronicPoint/api/v1/roles`;
  private apiUrlEmployees = `${environment.apiUrl}/eletronicPoint/api/v1/employees`;

  constructor(private http: HttpClient) {}

  getEmployeeByName(employeeName: string) {
    const url = `${this.apiUrlEmployees}/name/${encodeURIComponent(employeeName.trim())}`;
    return this.http.get<Employee[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getRoleByName(roleName: string) {
    const url = `${this.apiUrlRoles}/name/${encodeURIComponent(roleName.trim())}`;
    return this.http.get<Role[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  attachRoleToEmployee(attachRoleEmployee: AttachRoleEmployee): Observable<AttachRoleEmployee> {
    return this.http.post<AttachRoleEmployee>(this.apiUrlEmployeeRoles, attachRoleEmployee);
  }
}
