import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, first, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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
  sectors: {
    id?: number;
    name: string;
    company: {
      id: number;
      name: string;
    }
  };
}

export interface RolePutRequest {
  id: number,
  name: string,
  sectorId: number
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiRolesUrl = `${environment.apiUrl}/eletronicPoint/api/v1/roles`;
  private apiUrlCompanies = `${environment.apiUrl}/eletronicPoint/api/v1/companies`;
  private apiUrlSectors = `${environment.apiUrl}/eletronicPoint/api/v1/sectors`;
  private apiUrlEmployeesRoles = `${environment.apiUrl}/eletronicPoint/api/v1/employees_roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    console.log("CALLING GET ROLES");
    return this.http.get<Role[]>(this.apiRolesUrl);
  }

  searchRoles(term: string): Observable<Role[]> {
    console.log("SEARCH ROLES FOR TERM: ", term);
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

    return (requests as any[]).reduce((acc) => {
      return acc;
    }, this.http.get<Role[]>(urlByName));
  }

  getRoleByName(name: string): Observable<any> {
    const encoded = encodeURIComponent(name.trim());
    return this.http.get<any[]>(`${this.apiRolesUrl}/name/${encoded}`).pipe(
      map(arr => {
        if (!arr || arr.length === 0) {
          throw new Error('Role not found');
        }
        return arr[0];
      })
    );
  }

  searchRolesByNameAndCnpj(roleName: string, cnpj: string): Observable<Role[]> {
    const encName = encodeURIComponent(roleName.trim());
    const encCnpj = encodeURIComponent(cnpj.trim());
    const url = `${this.apiRolesUrl}/rolename/${encName}/cnpj/${encCnpj}`;
    return this.http.get<Role[]>(url).pipe(catchError(err => throwError(() => err)));
  }

  searchRolesByCnpj(cnpj: string): Observable<Role[]> {
    console.log("CALLING SEARCH ROLES FOR CNPJ: ", cnpj);

    const encoded = encodeURIComponent(cnpj);
    return this.http.get<Role[]>(`${this.apiRolesUrl}/cnpj/${encoded}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  searchRoleById(roleId: string): Observable<Role[]> {
    const encoded = encodeURIComponent(roleId);
    return this.http.get<Role[]>(`${this.apiRolesUrl}/id/${encoded}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  addRole(role: {name: string; sectorId: number }): Observable<Role> {
    console.log("Role Post Request: ", role)
    return this.http.post<Role>(this.apiRolesUrl, role).pipe(
      catchError(err => throwError(() => err))
    );
  }

  updateRole(rolePutRequest: RolePutRequest): Observable<RolePutRequest>{
    return this.http.put<RolePutRequest>(`${this.apiRolesUrl}/${rolePutRequest.id}`, rolePutRequest)
  }

  deleteRole(id: number): Observable<Role> {
      return this.http.delete<Role>(`${this.apiRolesUrl}/${id}`);
  }

  getSectorByNameAndCompany(sectorName: string,companyId: number): Observable<any> {

    if (!sectorName || !companyId) {
      return throwError(() => new Error('Sector name ou companyId inválido'));
    }

    const encName = encodeURIComponent(sectorName.trim());
    const url = `${this.apiUrlSectors}/name/${encName}/companyId/${companyId}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        if (!res) {
          throw new Error('Setor não encontrado para esta empresa');
        }

        return Array.isArray(res) ? res[0] : res;
      }),
      catchError(err => {
        if (err.status === 404) {
          return throwError(() => new Error('Setor não encontrado para esta empresa'));
        }

        return throwError(() => new Error('Erro ao buscar setor'));
      })
    );
  }

  createRole(name:string, sectorId: number): Observable<Role> {
    return this.addRole({ name, sectorId });
  }

  attachRoleToEmployee(data: AttachRoleData) {
    return this.http.post(this.apiUrlEmployeesRoles, data);
  }
}
