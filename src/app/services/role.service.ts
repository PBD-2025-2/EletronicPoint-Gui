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
    return this.http.get<Role[]>(this.apiRolesUrl);
  }

  searchRoles(roleName: string, sectorName?: string): Observable<any> {
    const trimmed = roleName.trim();

    // Input with only numbers
    if (/^\d+$/.test(trimmed)) {
      
      if (trimmed.length === 14) {
        return this.getRoleByCnpj(trimmed)
      }
      
      return this.getRoleById(trimmed);
    }

    if (roleName && sectorName) {
      return this.getRoleByNameAndSector(roleName, sectorName);
    }

    return this.getRoleByName(trimmed);
  }

  getRoleById(roleId: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiRolesUrl}/id/${roleId}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  getRoleByName(roleName: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiRolesUrl}/name/${roleName}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  getRoleByNameAndSector(roleName: string, sectorName: string): Observable<Role[]> {
    
    return this.http.get<Role[]>(`${this.apiRolesUrl}/name/${roleName}/sector/${sectorName}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  getRoleByCnpj(cnpj: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiRolesUrl}/cnpj/${cnpj}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  addRole(role: {name: string; sectorId: number }): Observable<Role> {
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
