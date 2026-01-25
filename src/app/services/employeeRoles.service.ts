import { Injectable } from '@angular/core';
import { Employee } from './employee.service';
import { Roster } from './roster.service';
import { Role } from './role.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeRoles {
    id: number;
    status: string;
    employee: Employee;
    role: Role;
    roster: Roster;
}

export interface EmployeeRolesPutRequest {
    id: number;
    status: boolean;
    idRoster: number;
    employeeId: number;
    roleId: number;
}

@Injectable({
    providedIn: 'root',
})

export class EmployeeRoleService { 
    private apiUrlEmployeeRoles = `${environment.apiUrl}/eletronicPoint/api/v1/employees_roles`;

    constructor (
        private http: HttpClient
    ) {}

    getAllEmployeesRoles(): Observable<EmployeeRoles[]> {
        return this.http.get<EmployeeRoles[]>(this.apiUrlEmployeeRoles);
    }

    getEmployeeRolesByEmployeeId(employeeId: number): Observable<EmployeeRoles[]> {
        return this.http.get<EmployeeRoles[]>(`${this.apiUrlEmployeeRoles}/employeeId/${employeeId}`);
    }

    getEmployeeRolesByName(name: string): Observable<EmployeeRoles[]> {
        const encodedName = encodeURIComponent(name.trim());
        return this.http.get<EmployeeRoles[]>(`${this.apiUrlEmployeeRoles}/name/${encodedName}`);
    }

    updateEmployeeRoles(employeePutRequest: EmployeeRolesPutRequest): Observable<EmployeeRoles> {
        return this.http.put<EmployeeRoles>(`${this.apiUrlEmployeeRoles}/${employeePutRequest.id}`, employeePutRequest);
    }
    
    deleteEmployeeRoles(employeeRolesId: number): Observable<EmployeeRoles> {
        return this.http.delete<EmployeeRoles>(`${this.apiUrlEmployeeRoles}/${employeeRolesId}`);
    }
}
