import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, filter, first, noop, Observable, throwError } from 'rxjs';
import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface AttachRoleData {
  status: string;
  idRoster: number;
  employeeId: number;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
  company: {     
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private apiRolesUrl = `${environment.apiUrl}/eletronicPoint/api/v1/roles`;
  private apiUrlCompany = `${environment.apiUrl}/eletronicPoint/api/v1/companies`;
  private apiUrlEmployeesRoles = `${environment.apiUrl}/eletronicPoint/api/v1/employees_roles`;
  

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiRolesUrl);
  }

  searchRoles(term: string): Observable<Role[]> {
    const encodedTerm = encodeURIComponent(term.trim());
    const urlByName = `${this.apiRolesUrl}/name/${encodedTerm}`;
    const urlByCnpj = `${this.apiRolesUrl}/cnpj/${encodedTerm}`;
    const urlById   = `${this.apiRolesUrl}/id/${encodedTerm}`;

    const safeGet = (url: string) =>
      this.http.get<Role[]>(url).pipe(catchError(err => throwError(() => err)));

    const safeGetId = (url: string) =>
      this.http.get<Role>(url).pipe(
        map(c => c ? [c] : []),
        catchError(err => throwError(() => err))
    );

    const requests = [
      safeGet(urlByName),
      safeGetId(urlById),
      safeGet(urlByCnpj)
    ];

    return concat(...requests).pipe(
      filter(arr => Array.isArray(arr) && arr.length > 0), 
      first(),
      defaultIfEmpty([]) 
    );
  }

  getRoleByName(name: string): Observable<any> {
    const encoded = encodeURIComponent(name.trim());
    return this.http.get<any[]>(`${this.apiRolesUrl}/name/${encoded}`).pipe(
      map(arr => {
        if (!arr || arr.length === 0) {
          throw new Error('Role is never not found');
        }
        return arr[0];
      })
    );
  }

  searchRolesByNameAndCnpj(roleName: string, cnpj: string): Observable<Role[]> {
    const encName = encodeURIComponent(roleName.trim());
    const encCnpj = encodeURIComponent(cnpj.trim());
    const url = `${this.apiRolesUrl}/rolename/${encName}/cnpj/${encCnpj}`;

    
    return this.http.get<Role[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  searchRolesByCnpj(cnpj: string): Observable<Role[]> {
    const encoded = encodeURIComponent(cnpj);
    return this.http.get<Role[]>(`${this.apiRolesUrl}/cnpj/${encoded}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  searchRoleById(roleId: string): Observable<Role[]> {
    const encoded = encodeURIComponent(roleId);

    return this.http.get<Role[]>(`${this.apiRolesUrl}/id/${encoded}`)
      .pipe( catchError(err => throwError(() => err)));
  }  

  addRole(role: { name: string; companyId: number }): Observable<Role> {
    return this.http.post<Role>(this.apiRolesUrl, role).pipe(
      catchError(err => throwError(() => err))
    );
  }

  attachRoleToEmployee(data: AttachRoleData) {
    return this.http.post(this.apiUrlEmployeesRoles, data);
  }

}
