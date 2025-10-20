import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, filter, first, noop, Observable, throwError } from 'rxjs';
import { of, concat } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Role {
  name: string;
  company: {     
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private apiUrlCompany = `${environment.apiUrl}/eletronicPoint/api/v1/companies`;
  private apiUrl = `${environment.apiUrl}/eletronicPoint/api/v1/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  searchRoles(term: string): Observable<Role[]> {
    const encodedTerm = encodeURIComponent(term.trim());
    const urlByName = `${this.apiUrl}/name/${encodedTerm}`;
    const urlByCnpj = `${this.apiUrl}/cnpj/${encodedTerm}`;
    const urlById   = `${this.apiUrl}/id/${encodedTerm}`;

    const safeGet = (url: string) =>
      this.http.get<Role[]>(url).pipe(catchError(err => throwError(() => err)));

    const safeGetId = (url: string) =>
      this.http.get<Role>(url).pipe(
        map(c => c ? [c] : []),
        catchError(err => throwError(() => err))
    );

    const requests = [
      safeGet(urlByName),
      safeGet(urlByCnpj),
      safeGetId(urlById)
    ];

    return concat(...requests).pipe(
      filter(arr => Array.isArray(arr) && arr.length > 0), 
      first(),
      defaultIfEmpty([]) 
    );
  }

  searchRolesByNameAndCnpj(roleName: string, cnpj: string): Observable<Role[]> {
    const encName = encodeURIComponent(roleName.trim());
    const encCnpj = encodeURIComponent(cnpj.trim());
    const url = `${this.apiUrl}/rolename/${encName}/cnpj/${encCnpj}`;

    return this.http.get<Role[]>(url).pipe(
      catchError(err => throwError(() => err))
    );
  }

  searchRolesByCnpj(cnpj: string): Observable<Role[]> {
    const encoded = encodeURIComponent(cnpj);
    return this.http.get<Role[]>(`${this.apiUrl}/cnpj/${encoded}`)
      .pipe( catchError(err => throwError(() => err)));
  }

  addRole(role: { name: string; companyId: number }): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

}
