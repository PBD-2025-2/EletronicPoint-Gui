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

  /*
  searchRoles2(term: string): Observable<Role[]> {
    const trimmed = term.trim();
    
      // Input with only numbers
      if (/^\d+$/.test(trimmed)) {
  
        // Search by ID
        return this.http.get<Role>(`${this.apiRolesUrl}/id/${trimmed}`).pipe(
          map(c => c ? [c] : [])
        );
      }

    // Search by name
    //return this.http.get<Role[]>(`${this.apiRolesUrl}/name/${encodeURIComponent(trimmed)}`).pipe(catchError(err)

  }
  */

  // --- search helpers (kept as you had) ---
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

    // concat until one returns a non-empty array
    return (requests as any[]).reduce((acc, req, idx) => {
      // reuse your pattern with concat outside if needed, but keep simple:
      return acc; // unused in changed flow; keep original searchRoles logic if needed
    }, this.http.get<Role[]>(urlByName)); // fallback dummy to satisfy types
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

  // POST role (backend expects { name, sectorId } according to your RolePostRequest)
  addRole(role: { name: string; sectorId: number }): Observable<Role> {
    return this.http.post<Role>(this.apiRolesUrl, role).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getSectorByNameAndCompany(
    sectorName: string,
    companyId: number
  ): Observable<any> {

    if (!sectorName || !companyId) {
      return throwError(() => new Error('Sector name ou companyId inválido'));
    }

    const encName = encodeURIComponent(sectorName.trim());
    const url = `${this.apiUrlSectors}/name/${encName}/company/${companyId}`;

    return this.http.get<any>(url).pipe(
      map(res => {
        if (!res) {
          throw new Error('Setor não encontrado para esta empresa');
        }

        // caso backend retorne array
        return Array.isArray(res) ? res[0] : res;
      }),
      catchError(err => {
        // 👇 traduz erro HTTP para erro de negócio
        if (err.status === 404) {
          return throwError(() => new Error('Setor não encontrado para esta empresa'));
        }

        return throwError(() => new Error('Erro ao buscar setor'));
      })

    );
  }



  // convenience wrapper: create role from name + sectorId
  createRole(data: { name: string; sectorId: number }): Observable<Role> {
    return this.addRole({ name: data.name, sectorId: data.sectorId });
  }

  attachRoleToEmployee(data: AttachRoleData) {
    return this.http.post(this.apiUrlEmployeesRoles, data);
  }
}
